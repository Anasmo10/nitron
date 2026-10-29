# Original music bed + sound design for the Nitron reel (synthesised from scratch, no samples).
import json, numpy as np, subprocess, sys
from scipy.signal import butter, sosfilt, fftconvolve
SR=48000; W=sys.argv[1]
caps=json.load(open(W+"/caps.json")); VEND=caps["total"]; OUT=json.load(open(W+"/sfx.json"))["outro"]; T=VEND+OUT+0.8
N=int(T*SR); rng=np.random.default_rng(7)
def z(): return np.zeros((N,2))
def sos(kind,f,o=2): return butter(o,f,btype=kind,fs=SR,output='sos')
def filt(x,kind,f,o=2): return sosfilt(sos(kind,f,o),x,axis=0)
def at(buf,t,sig,g=1.0,pan=0.0):
    i=int(t*SR); 
    if i>=N: return
    sig=sig if sig.ndim==2 else np.stack([sig*np.sqrt(0.5*(1-pan)),sig*np.sqrt(0.5*(1+pan))],1)*np.sqrt(2)
    j=min(N,i+len(sig)); buf[i:j]+=sig[:j-i]*g
def tt(d): return np.arange(int(d*SR))/SR
def sat(x,d): return np.tanh(d*x)/np.tanh(d)
def ir(d=1.4,tau=0.35,lp=6000,seed=1):
    r=np.random.default_rng(seed); n=int(d*SR); e=np.exp(-np.arange(n)/SR/tau)
    L=filt(r.standard_normal(n)*e,'low',lp); R=filt(r.standard_normal(n)*e,'low',lp); return L/np.abs(L).sum()*40, R/np.abs(R).sum()*40
IRL,IRR=ir()
def verb(x,wet):
    m=x.mean(1); l=fftconvolve(m,IRL)[:len(m)]; r=fftconvolve(m,IRR)[:len(m)]; return x+np.stack([l,r],1)*wet
def sweep_bp(x,f0,f1,q=1.2,blk=512):          # band-pass whose centre glides f0→f1 (block-wise, state carried)
    y=np.zeros_like(x); zi=None; nb=int(np.ceil(len(x)/blk))
    for b in range(nb):
        f=f0*(f1/f0)**(b/max(1,nb-1)); lo,hi=f/(1+1/(2*q)),min(f*(1+1/(2*q)),SR/2-100)
        s=sos('band',[lo,hi]); 
        if zi is None or zi.shape!=(s.shape[0],2): zi=np.zeros((s.shape[0],2))
        y[b*blk:(b+1)*blk],zi=sosfilt(s,x[b*blk:(b+1)*blk],zi=zi)
    return y
# ── instruments ──
def kick(d=0.42,hard=1.0):
    t=tt(d); f=46+(130-46)*np.exp(-t/0.045); ph=2*np.pi*np.cumsum(f)/SR
    body=np.sin(ph)*np.exp(-t/0.20); click=filt(rng.standard_normal(len(t))*np.exp(-t/0.003),'high',2500)*0.35
    return sat(body*hard+click,1.6)
def clap():
    t=tt(0.32); n=rng.standard_normal(len(t)); e=np.zeros(len(t))
    for k,dt in enumerate([0,0.011,0.022]): e+=np.exp(-np.clip(t-dt,0,None)/0.010)*(t>=dt)*(0.8 if k<2 else 1)
    e+=0.5*np.exp(-np.clip(t-0.022,0,None)/0.09)*(t>=0.022)
    return filt(n*e,'band',[900,3200])*1.4
def hat(open_=False,v=1.0):
    d=0.22 if open_ else 0.05; t=tt(d); n=rng.standard_normal(len(t))
    return filt(n*np.exp(-t/(0.07 if open_ else 0.012)),'high',7500,3)*v
def b808(f,d=1.1,glide_from=None):
    t=tt(d); fr=np.full(len(t),f) if glide_from is None else f+(glide_from-f)*np.exp(-t/0.06)
    s=np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t/0.55)*np.minimum(1,t/0.004)
    return filt(sat(s,2.2),'low',900)
def pad(freqs,d,lp=1100,att=0.25):
    t=tt(d); outL=np.zeros(len(t)); outR=np.zeros(len(t))
    for f in freqs:
        for k,c in enumerate([-0.12,0.0,0.12]):          # detuned saws, spread L/R
            fr=f*2**(c/12); ph=(fr*t+rng.random())%1; saw=2*ph-1
            (outL if k!=2 else outR)[:]+=saw*0.6; (outR if k!=0 else outL)[:]+=saw*0.4
    env=np.minimum(1,t/att)*np.minimum(1,(d-t)/0.35).clip(0,1)
    x=np.stack([outL,outR],1)*env[:,None]/len(freqs); return filt(x,'low',lp,4)
def pluck(f,d=0.45):
    t=tt(d); ph=(f*t)%1; sq=np.where(ph<0.5,1,-1)*0.5+(2*ph-1)*0.5
    return filt(sq*np.exp(-t/0.12),'low',2400)
def noise_swell(d,f0,f1,rev=False):
    t=tt(d); e=(t/d)**2.2; x=sweep_bp(rng.standard_normal(len(t)),f0,f1,q=0.9)*e
    return x[::-1] if rev else x
# ── score ──
M=z(); P=0.35; BAR=1.4
CH=[[146.83,174.61,220.0,293.66],[116.54,146.83,174.61,233.08],[98.0,116.54,146.83,196.0],[110.0,138.59,164.81,220.0]]
ROOT=[73.42,58.27,49.0,55.0]
step=BAR/16
# intro: bar 0 Dm muffled, bar 1 Bb with the sub drop on «لا تشتريها»
at(M,0.0,pad(CH[0],1.5,lp=520),0.55); at(M,1.4,pad(CH[1],1.45,lp=700),0.55)
at(M,0.0,kick(hard=0.7),0.42); at(M,0.7,filt(kick(hard=0.5),'low',400),0.30)
at(M,1.4,b808(73.42,1.3,glide_from=110),0.62); at(M,1.4,kick(),0.55)
for k in range(8): at(M,1.4+0.7+k*step*0.5*1.0,hat(v=0.35+0.08*k),0.30,pan=0.25)      # hats tighten into the drop
at(M,1.85,np.stack([noise_swell(0.95,300,7000)]*2,1),0.20)
# groove: bars 2..7 (2.8 → 11.2)
for b in range(2,8):
    t0=b*BAR; c=(b-2)%4
    at(M,t0,pad(CH[c],BAR+0.05,lp=950),0.34)
    at(M,t0,b808(ROOT[c],1.25),0.60)
    if b%2: at(M,t0+10*step,b808(ROOT[c]*2,0.35,glide_from=ROOT[c]),0.30)
    kicks=[0,6,10] if b%2==0 else [0,7,11,14]
    for s_ in kicks: at(M,t0+s_*step,kick(),0.62)
    at(M,t0+8*step,clap(),0.40)
    for s_ in range(0,16,2): at(M,t0+s_*step,hat(v=1.0 if s_%4==0 else 0.7),0.20,pan=0.2)
    if b in (3,5,7):
        for s_ in [12,12.5,13,13.5,14,14.33,14.66,15,15.33,15.66]: at(M,t0+s_*step,hat(v=0.6),0.17,pan=-0.15)
    else: at(M,t0+14*step,hat(True,0.8),0.16,pan=0.3)
    arp=[CH[c][3]*2,CH[c][2]*2,CH[c][1]*2,CH[c][2]*2]
    for i,s_ in enumerate([0,3,6,9,12]):
        if b>=4: at(M,t0+s_*step,pluck(arp[i%4]),0.10,pan=(-0.4 if i%2 else 0.4))
# break before «نايترون», then the outro hit on the logo card
at(M,10.85,np.stack([noise_swell(0.70,400,9000)]*2,1),0.16)
at(M,VEND,kick(hard=1.1),0.70); at(M,VEND,b808(73.42,2.0,glide_from=146.8),0.62)
at(M,VEND,filt(np.stack([rng.standard_normal(int(1.6*SR))*np.exp(-tt(1.6)/0.5)]*2,1),'high',4000),0.10)
at(M,VEND,pad(CH[0],OUT+0.6,lp=1400,att=0.08),0.50)
for s_ in range(0,int(OUT/step*2)):
    tt_=VEND+0.7+s_*step*1.0
    if tt_<VEND+OUT-0.2: at(M,tt_,hat(v=0.5),0.12,pan=0.2)
M=verb(M,0.16); M=filt(M,'high',28)
M=M-0.45*filt(M,'band',[900,4200])          # carve the speech band so his voice sits on top
# kill the groove between 11.2 and the outro hit (the break)
g=np.ones(N); a,b_=int(11.22*SR),int(VEND*SR); g[a:b_]=np.linspace(1,0.12,b_-a)**2; M*=g[:,None]
# ── sound design ──
S=z()
def whoosh(d,f0,f1,rev=False):
    t=tt(d); e=np.sin(np.pi*np.clip(t/d,0,1))**1.6; x=sweep_bp(rng.standard_normal(len(t)),f0,f1,q=1.1)*e
    x=x[::-1] if rev else x; l=x*(0.6+0.4*np.linspace(1,0,len(x))); r=x*(0.6+0.4*np.linspace(0,1,len(x)))
    return np.stack([l,r],1)
def impact(f0=58,d=1.0):
    t=tt(d); f=f0*0.62+f0*0.38*np.exp(-t/0.08); s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.30)
    n=filt(rng.standard_normal(len(t))*np.exp(-t/0.05),'low',2200)*0.5
    return sat(s+n,1.5)
def stamp():
    t=tt(0.16); s=np.sin(2*np.pi*140*t)*np.exp(-t/0.035); n=filt(rng.standard_normal(len(t))*np.exp(-t/0.010),'band',[600,3500])
    return s+0.8*n
def pop(f0=820):
    t=tt(0.09); f=f0*0.45+f0*0.55*np.exp(-t/0.018); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.03)
def click():
    t=tt(0.06); n=rng.standard_normal(len(t)); e=np.exp(-t/0.0025)+0.7*np.exp(-np.clip(t-0.028,0,None)/0.002)*(t>0.028)
    return filt(n*e,'band',[1800,6000])
def ding(fs=(1318.5,1975.5)):
    t=tt(0.6); return sum(np.sin(2*np.pi*f*t)*np.exp(-t/(0.22 if i==0 else 0.12))*(1 if i==0 else 0.45) for i,f in enumerate(fs))
def power(f0,f1,d):
    t=tt(d); f=f0*(f1/f0)**(t/d); s=np.sin(2*np.pi*np.cumsum(f)/SR)+0.35*np.sin(4*np.pi*np.cumsum(f)/SR)
    trem=0.75+0.25*np.sin(2*np.pi*14*t); e=np.minimum(1,t/0.03)*np.minimum(1,(d-t)/0.08).clip(0,1)
    return filt(s*trem*e,'low',3000)
def shimmer(d=0.55):
    t=tt(d); x=filt(rng.standard_normal(len(t)),'high',6500)*np.sin(np.pi*t/d)**2*0.6
    for f,dt in [(1174.7,0.0),(1760.0,0.07),(2349.3,0.14)]:
        k=(t>=dt); x+=k*np.sin(2*np.pi*f*(t-dt))*np.exp(-np.clip(t-dt,0,None)/0.18)*0.35
    return x
cw=caps["cards"]; wS=lambda c,i: cw[c]["w"][i]["s"]
at(S,0.0,whoosh(0.42,350,2600),0.30)                                   # card flies in
at(S,wS(0,2)-0.03,pop(760),0.16,-0.5); at(S,wS(0,2)+0.09,pop(900),0.14,0.5)   # stickers
at(S,wS(1,0)-0.02,impact(),0.62); at(S,wS(1,0)+0.05,stamp(),0.40,-0.4); at(S,wS(1,1)+0.09,stamp(),0.36,0.4)
at(S,2.48,whoosh(0.36,500,4200),0.30)                                  # card opens to full screen
at(S,wS(2,3)-0.05,click(),0.30); at(S,wS(2,3)+0.10,ding(),0.10)        # looks → your problem
at(S,4.55,whoosh(0.34,3600,420,rev=False),0.22)                        # drop into the info panel
at(S,wS(3,1),power(520,120,0.85),0.09)                                 # grip drains
at(S,wS(4,2)-0.06,power(160,880,0.40),0.10); at(S,wS(4,2)+0.30,shimmer(0.4),0.10)   # strap refills it
for k,dt in enumerate([wS(5,4)-0.04,wS(5,4)+0.08,wS(5,5)-0.04]): at(S,dt,pop(1100+120*k),0.08,(-0.3,0,0.3)[k])
at(S,9.47,whoosh(0.34,420,3200),0.22)                                  # back to full screen
at(S,wS(7,0)-0.10,whoosh(0.30,300,1800),0.16)                          # brand plate rises
at(S,wS(7,2)-0.06,shimmer(0.6),0.14)                                   # wordmark wipes in
at(S,VEND-0.30,whoosh(0.34,600,5200),0.24)                             # outro card wipe
S=verb(S,0.10)
# ── duck the music under the voice (~-7 dB), keep it alive in gaps ──
v=np.fromfile(W+"/voice.f32",np.float32).astype(np.float64); v=np.pad(v,(0,max(0,N-len(v))))[:N]
hop=480; env=np.sqrt(np.convolve(v**2,np.ones(hop)/hop,'same')); act=(env>0.012).astype(float)
k_att,k_rel=np.exp(-1/(0.015*SR)),np.exp(-1/(0.28*SR)); d=np.zeros(N); y=0.0
for i in range(0,N,hop):
    tgt=act[i]; c=k_att**hop if tgt>y else k_rel**hop; y=tgt+(y-tgt)*c; d[i:i+hop]=y
duck=10**(-9.0*d/20)
Mn=M/np.abs(M).max()*0.5; Sn=S/max(1e-9,np.abs(S).max())*0.5
bed=Mn*0.45*duck[:,None]+Sn*0.80
bed=np.clip(bed,-0.97,0.97)
for name,x in [("music.wav",Mn),("sfx_only.wav",Sn),("sfx.wav",bed)]:
    raw=(np.clip(x,-1,1)*32767).astype('<i2').tobytes()
    subprocess.run(["ffmpeg","-v","error","-y","-f","s16le","-ar",str(SR),"-ac","2","-i","-",W+"/"+name],input=raw,check=True)
sp=np.repeat(act[::hop],hop)[:N]>0.5
mu=Mn*0.45*duck[:,None]; r=lambda x,m: 10*np.log10((x[m]**2).mean()+1e-12)
print("ok", round(T,2), "s · peak bed", round(float(np.abs(bed).max()),3), "· music vs voice under speech: %.1f dB"%(r(mu.mean(1),sp)-r(v,sp)), "· in gaps: %.1f dB"%(r(mu.mean(1),~sp&(np.arange(N)<int(VEND*SR)))-r(v,sp)))
