import sys, json, numpy as np
sys.path.insert(0, sys.argv[0].rsplit("/",1)[0])
from ctc import logits, toks
DIAC=set("ًٌٍَُِّْـ")
tid={t:i for i,t in enumerate(toks) if i>3}
def enc(words):
    ids=[];wmap=[]
    for wi,w in enumerate(words):
        if wi: ids.append(tid[" "]); wmap.append(-1)
        for ch in w:
            if ch in DIAC: continue
            if ch not in tid: print("skip char",ch,file=sys.stderr); continue
            ids.append(tid[ch]); wmap.append(wi)
    return ids,wmap
def viterbi(lp, ids, blank=0):
    T=lp.shape[0]; L=2*len(ids)+1
    ext=[blank if i%2==0 else ids[i//2] for i in range(L)]
    NEG=-1e18; dp=np.full((T,L),NEG); bp=np.zeros((T,L),dtype=np.int32)
    dp[0,0]=lp[0,ext[0]]; dp[0,1]=lp[0,ext[1]]
    for t in range(1,T):
        for s in range(L):
            c=[(dp[t-1,s],s)]
            if s>0: c.append((dp[t-1,s-1],s-1))
            if s>1 and ext[s]!=blank and ext[s]!=ext[s-2]: c.append((dp[t-1,s-2],s-2))
            v,b=max(c); dp[t,s]=v+lp[t,ext[s]]; bp[t,s]=b
    s=L-1 if dp[T-1,L-1]>dp[T-1,L-2] else L-2; score=dp[T-1,s]
    path=[0]*T
    for t in range(T-1,-1,-1): path[t]=s; s=bp[t,s]
    return path, ext, score
def align(lg, fd, words, t0=0.0):
    lp=lg-np.logaddexp.reduce(lg,axis=1,keepdims=True)
    ids,wmap=enc(words); path,ext,score=viterbi(lp,ids)
    st={};en={}
    for t,s in enumerate(path):
        if s%2==1:
            wi=wmap[s//2]
            if wi<0: continue
            st.setdefault(wi,t); en[wi]=t
    return [(w, round(t0+st[i]*fd,3), round(t0+(en[i]+1)*fd,3)) for i,w in enumerate(words)], score
if __name__=="__main__":
    lg,fd=logits(sys.argv[1]); np.save(sys.argv[1][:-4]+".lg.npy",lg); print("fd",fd)
