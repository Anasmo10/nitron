"""Nitron kit — house music bed + sound design, synthesised from scratch (no samples, no licences).
python3 sound.py <work>    reads caps.json · sfx.json (outro) · voice.f32 · sound.json
writes music.wav (bed alone) · sfx_only.wav · sfx.wav (= bed ducked under the voice + sfx, what 06_encode mixes)

House sound: dark minimal trap in D minor, beat 0.35 s (bar 1.4 s), half-time feel.
  intro (muffled) → sub drop on the hook slam → riser → full groove from the first cut ("drop")
  → groove breaks just before the outro → outro hit on the logo card.
Mix: music ~12 dB under the voice while he talks (−9 dB ducking + speech-band carve), ~9 dB in the gaps.

sound.json = {"drop": s, "slam": s|null, "events": [[kind, t, gain, ...args]]}
  kinds: whoosh(f0,f1,dur) · impact · stamp(pan) · pop(pan,freq) · click · ding · power_down(dur) · power_up(dur) · shimmer(dur)
"""
import json, numpy as np, subprocess, sys
from scipy.signal import butter, sosfilt, fftconvolve
SR=48000; W=sys.argv[1]
caps=json.load(open(W+"/caps.json")); VEND=caps["total"]; OUT=json.load(open(W+"/sfx.json"))["outro"]
cfg=json.load(open(W+"/sound.json")); DROP=cfg["drop"]; SLAM=cfg.get("slam")
T=VEND+OUT+0.8; N=int(T*SR); rng=np.random.default_rng(7)
def z(): return np.zeros((N,2))
def sos(kind,f,o=2): return butter(o,f,btype=kind,fs=SR,output='sos')
def filt(x,kind,f,o=2): return sosfilt(sos(kind,f,o),x,axis=0)
def at(buf,t,sig,g=1.0,pan=0.0):
    i=int(t*SR)
    if i>=N or i+len(sig)<=0: return
    sig=sig if sig.ndim==2 else np.stack([sig*np.sqrt(0.5*(1-pan)),sig*np.sqrt(0.5*(1+pan))],1)*np.sqrt(2)
    if i<0: sig=sig[-i:]; i=0
    j=min(N,i+len(sig)); buf[i:j]+=sig[:j-i]*g
def tt(d): return np.arange(int(d*SR))/SR
def sat(x,d): return np.tanh(d*x)/np.tanh(d)
def ir(d=1.4,tau=0.35,lp=6000,seed=1):
    r=np.random.default_rng(seed); n=int(d*SR); e=np.exp(-np.arange(n)/SR/tau)
    L=filt(r.standard_normal(n)*e,'low',lp); R=filt(r.standard_normal(n)*e,'low',lp); return L/np.abs(L).sum()*40, R/np.abs(R).sum()*40
IRL,IRR=ir()
def verb(x,wet):
    m=x.mean(1); return x+np.stack([fftconvolve(m,IRL)[:len(m)],fftconvolve(m,IRR)[:len(m)]],1)*wet
def sweep_bp(x,f0,f1,q=1.2,blk=512):
    y=np.zeros_like(x); zi=None; nb=int(np.ceil(len(x)/blk))
    for b in range(nb):
        f=f0*(f1/f0)**(b/max(1,nb-1)); lo,hi=f/(1+1/(2*q)),min(f*(1+1/(2*q)),SR/2-100); s=sos('band',[lo,hi])
        if zi is None: zi=np.zeros((s.shape[0],2))
        y[b*blk:(b+1)*blk],zi=sosfilt(s,x[b*blk:(b+1)*blk],zi=zi)
    return y
# ── instruments ──
def kick(d=0.42,hard=1.0):
    t=tt(d); f=46+(130-46)*np.exp(-t/0.045); body=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.20)
    click=filt(rng.standard_normal(len(t))*np.exp(-t/0.003),'high',2500)*0.35; return sat(body*hard+click,1.6)
def clap():
    t=tt(0.32); n=rng.standard_normal(len(t)); e=np.zeros(len(t))
    for k,dt in enumerate([0,0.011,0.022]): e+=np.exp(-np.clip(t-dt,0,None)/0.010)*(t>=dt)*(0.8 if k<2 else 1)
    e+=0.5*np.exp(-np.clip(t-0.022,0,None)/0.09)*(t>=0.022); return filt(n*e,'band',[900,3200])*1.4
def hat(open_=False,v=1.0):
    d=0.22 if open_ else 0.05; t=tt(d); return filt(rng.standard_normal(len(t))*np.exp(-t/(0.07 if open_ else 0.012)),'high',7500,3)*v
def b808(f,d=1.1,glide_from=None):
    t=tt(d); fr=np.full(len(t),f) if glide_from is None else f+(glide_from-f)*np.exp(-t/0.06)
    return filt(sat(np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t/0.55)*np.minimum(1,t/0.004),2.2),'low',900)
def pad(freqs,d,lp=1100,att=0.25):
    t=tt(d); L=np.zeros(len(t)); R=np.zeros(len(t))
    for f in freqs:
        for k,c in enumerate([-0.12,0.0,0.12]):
            saw=2*((f*2**(c/12)*t+rng.random())%1)-1; (L if k!=2 else R)[:]+=saw*0.6; (R if k!=0 else L)[:]+=saw*0.4
    env=np.minimum(1,t/att)*np.minimum(1,(d-t)/0.35).clip(0,1); return filt(np.stack([L,R],1)*env[:,None]/len(freqs),'low',lp,4)
def pluck(f,d=0.45):
    t=tt(d); ph=(f*t)%1; return filt((np.where(ph<0.5,1,-1)*0.5+(2*ph-1)*0.5)*np.exp(-t/0.12),'low',2400)
def swell(d,f0,f1):
    t=tt(d); return sweep_bp(rng.standard_normal(len(t)),f0,f1,q=0.9)*(t/d)**2.2
# ── score on a grid anchored so a downbeat lands on the drop ──
M=z(); BAR=1.4; step=BAR/16
CH=[[146.83,174.61,220.0,293.66],[116.54,146.83,174.61,233.08],[98.0,116.54,146.83,196.0],[110.0,138.59,164.81,220.0]]
ROOT=[73.42,58.27,49.0,55.0]
first=-int(np.ceil(DROP/BAR))                       # intro bars before the drop (bar 0 = drop)
for b in range(first,0):
    t0=DROP+b*BAR; c=(b-first)%2
    at(M,max(0,t0),pad(CH[c],BAR+0.05,lp=520+180*(b-first)),0.55)
    at(M,t0,kick(hard=0.7),0.40); at(M,t0+8*step,filt(kick(hard=0.5),'low',400),0.28)
for k in range(8): at(M,DROP-0.7+k*step*0.5,hat(v=0.35+0.08*k),0.30,pan=0.25)
at(M,DROP-0.95,np.stack([swell(0.95,300,7000)]*2,1),0.20)
if SLAM is not None: at(M,SLAM,b808(73.42,1.3,glide_from=110),0.62); at(M,SLAM,kick(),0.55)
BRK=VEND-0.34; nb=int(np.ceil((BRK-DROP)/BAR))
for b in range(nb):
    t0=DROP+b*BAR; c=b%4
    at(M,t0,pad(CH[c],BAR+0.05,lp=950),0.34); at(M,t0,b808(ROOT[c],1.25),0.60)
    if b%2: at(M,t0+10*step,b808(ROOT[c]*2,0.35,glide_from=ROOT[c]),0.30)
    for s_ in ([0,6,10] if b%2==0 else [0,7,11,14]): at(M,t0+s_*step,kick(),0.62)
    at(M,t0+8*step,clap(),0.40)
    for s_ in range(0,16,2): at(M,t0+s_*step,hat(v=1.0 if s_%4==0 else 0.7),0.20,pan=0.2)
    if b%2: [at(M,t0+s_*step,hat(v=0.6),0.17,pan=-0.15) for s_ in [12,12.5,13,13.5,14,14.33,14.66,15,15.33,15.66]]
    else: at(M,t0+14*step,hat(True,0.8),0.16,pan=0.3)
    if b>=2:
        arp=[CH[c][3]*2,CH[c][2]*2,CH[c][1]*2,CH[c][2]*2]
        for i,s_ in enumerate([0,3,6,9,12]): at(M,t0+s_*step,pluck(arp[i%4]),0.10,pan=(-0.4 if i%2 else 0.4))
at(M,VEND-0.72,np.stack([swell(0.70,400,9000)]*2,1),0.16)
at(M,VEND,kick(hard=1.1),0.70); at(M,VEND,b808(73.42,2.0,glide_from=146.8),0.62)
at(M,VEND,filt(np.stack([rng.standard_normal(int(1.6*SR))*np.exp(-tt(1.6)/0.5)]*2,1),'high',4000),0.10)
at(M,VEND,pad(CH[0],OUT+0.6,lp=1400,att=0.08),0.50)
s_=0
while VEND+0.7+s_*step<VEND+OUT-0.2: at(M,VEND+0.7+s_*step,hat(v=0.5),0.12,pan=0.2); s_+=1
M=verb(M,0.16); M=filt(M,'high',28); M=M-0.45*filt(M,'band',[900,4200])      # leave the speech band to his voice
g=np.ones(N); a,b_=int((BRK+0.02)*SR),int(VEND*SR); g[a:b_]=np.linspace(1,0.12,max(1,b_-a))**2; M*=g[:,None]
# ── sound design palette ──
def whoosh(d,f0,f1):
    t=tt(d); e=np.sin(np.pi*np.clip(t/d,0,1))**1.6; x=sweep_bp(rng.standard_normal(len(t)),f0,f1,q=1.1)*e
    return np.stack([x*(0.6+0.4*np.linspace(1,0,len(x))),x*(0.6+0.4*np.linspace(0,1,len(x)))],1)
def impact(f0=58,d=1.0):
    t=tt(d); f=f0*0.62+f0*0.38*np.exp(-t/0.08); s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.30)
    return sat(s+filt(rng.standard_normal(len(t))*np.exp(-t/0.05),'low',2200)*0.5,1.5)
def stamp():
    t=tt(0.16); return np.sin(2*np.pi*140*t)*np.exp(-t/0.035)+0.8*filt(rng.standard_normal(len(t))*np.exp(-t/0.010),'band',[600,3500])
def pop(f0=820):
    t=tt(0.09); f=f0*0.45+f0*0.55*np.exp(-t/0.018); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.03)
def click():
    t=tt(0.06); e=np.exp(-t/0.0025)+0.7*np.exp(-np.clip(t-0.028,0,None)/0.002)*(t>0.028); return filt(rng.standard_normal(len(t))*e,'band',[1800,6000])
def ding(fs=(1318.5,1975.5)):
    t=tt(0.6); return sum(np.sin(2*np.pi*f*t)*np.exp(-t/(0.22 if i==0 else 0.12))*(1 if i==0 else 0.45) for i,f in enumerate(fs))
def power(f0,f1,d):
    t=tt(d); f=f0*(f1/f0)**(t/d); ph=2*np.pi*np.cumsum(f)/SR; e=np.minimum(1,t/0.03)*np.minimum(1,(d-t)/0.08).clip(0,1)
    return filt((np.sin(ph)+0.35*np.sin(2*ph))*(0.75+0.25*np.sin(2*np.pi*14*t))*e,'low',3000)
def shimmer(d=0.55):
    t=tt(d); x=filt(rng.standard_normal(len(t)),'high',6500)*np.sin(np.pi*t/d)**2*0.6
    for f,dt in [(1174.7,0.0),(1760.0,0.07),(2349.3,0.14)]: x+=(t>=dt)*np.sin(2*np.pi*f*(t-dt))*np.exp(-np.clip(t-dt,0,None)/0.18)*0.35
    return x
S=z()
for e in cfg["events"]:
    k,t,g=e[0],e[1],e[2]; a=e[3:]
    if k=="whoosh": at(S,t,whoosh(a[2] if len(a)>2 else 0.36,a[0] if a else 400,a[1] if len(a)>1 else 3000),g)
    elif k=="impact": at(S,t,impact(),g)
    elif k=="stamp": at(S,t,stamp(),g,a[0] if a else 0)
    elif k=="pop": at(S,t,pop(a[1] if len(a)>1 else 820),g,a[0] if a else 0)
    elif k=="click": at(S,t,click(),g)
    elif k=="ding": at(S,t,ding(),g)
    elif k=="power_down": at(S,t,power(520,120,a[0] if a else 0.85),g)
    elif k=="power_up": at(S,t,power(160,880,a[0] if a else 0.40),g)
    elif k=="shimmer": at(S,t,shimmer(a[0] if a else 0.55),g)
    else: raise SystemExit("unknown sfx kind: "+k)
at(S,VEND-0.30,whoosh(0.34,600,5200),0.24)              # every outro card wipes in on the same whoosh
S=verb(S,0.10)
# ── duck under the voice ──
v=np.fromfile(W+"/voice.f32",np.float32).astype(np.float64); v=np.pad(v,(0,max(0,N-len(v))))[:N]
hop=480; env=np.sqrt(np.convolve(v**2,np.ones(hop)/hop,'same')); act=(env>0.012).astype(float)
ka,kr=np.exp(-1/(0.015*SR)),np.exp(-1/(0.28*SR)); d=np.zeros(N); y=0.0
for i in range(0,N,hop):
    tg=act[i]; y=tg+(y-tg)*((ka if tg>y else kr)**hop); d[i:i+hop]=y
duck=10**(-9.0*d/20)
Mn=M/np.abs(M).max()*0.5; Sn=S/max(1e-9,np.abs(S).max())*0.5
sp=np.repeat(act[::hop],hop)[:N]>0.5; r=lambda x,m: 10*np.log10((x[m]**2).mean()+1e-12)
MG=0.45*10**(np.clip(-12.0-(r((Mn*0.45*duck[:,None]).mean(1),sp)-r(v,sp)),-4,4)/20)   # house level: music 12 dB under the voice
bed=np.clip(Mn*MG*duck[:,None]+Sn*0.80,-0.97,0.97)
for name,x in [("music.wav",Mn),("sfx_only.wav",Sn),("sfx.wav",bed)]:
    subprocess.run(["ffmpeg","-v","error","-y","-f","s16le","-ar",str(SR),"-ac","2","-i","-",W+"/"+name],input=(np.clip(x,-1,1)*32767).astype('<i2').tobytes(),check=True)
mu=(Mn*MG*duck[:,None]).mean(1)
print("ok %.2fs · music vs voice: %.1f dB under speech · %.1f dB in gaps"%(T,r(mu,sp)-r(v,sp),r(mu,~sp&(np.arange(N)<int(VEND*SR)))-r(v,sp)))
