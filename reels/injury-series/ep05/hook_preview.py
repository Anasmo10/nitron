"""EP05 v5: one preview clip per hook option (0–6 s: the hook and Ahmad's first words), with his voice, the music bed
and each option's own effects, for the client to choose from (16 Nov: «رجّيني الحلول، ما تمنتج وتقطع وتنهي من عندك»).
python3 hook_preview.py <A|B|C> <frames dir (out/ 00000.jpg…)> <out.mp4>"""
import sys, json, subprocess, numpy as np
from scipy.io import wavfile
opt,FR,OUT=sys.argv[1],sys.argv[2],sys.argv[3]; E='/home/user/work/ep5/ep'; SR=48000; DUR=6.0
cut=json.load(open('/home/user/work/ep5/hook/opts.json'))['cut']; cat=json.load(open('/home/user/nitron/nitron-kit/sfx/catalog.json'))
EV={'A':[('es_riser_dark',cut,0.20),('es_swish',cut+0.06,0.30),('es_rev_dark',cut+0.42,0.22),('es_imp_deep',cut+0.42,0.34),('es_crack',cut+0.46,0.32)],
    'B':[('es_riser_dark',cut,0.20),('es_sink',cut+0.02,0.30),('es_swish',cut+0.48,0.24),('es_rev_dark',cut+1.06,0.22),('es_imp_deep',cut+1.06,0.34),('es_crack',cut+1.10,0.32)],
    'C':[('es_riser_dark',1.5,0.18),('es_swish',1.95,0.26),('es_rev_dark',2.16,0.22),('es_imp_deep',2.16,0.34),('es_crack',2.20,0.32)]}[opt]
def rd(p):
    a=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(a,np.float32).reshape(-1,2).copy()
N=int(DUR*SR); mix=np.zeros((N,2),np.float32)
v=rd(E+'/voice.wav')[:N]; mix[:len(v)]+=v
m=rd(E+'/music.wav')[:N]; env=np.interp(np.arange(len(m))/SR,[0,4.0,4.1,6],[0.18,0.18,0.12,0.12])[:,None]; mix[:len(m)]+=m*env
for name,t,g in EV:
    s=rd(f'/home/user/nitron/nitron-kit/sfx/{name}.wav'); i=int((t-cat[name]['peak_at'])*SR); j0=max(0,-i); i=max(0,i)
    n=min(len(s)-j0,N-i); mix[i:i+n]+=s[j0:j0+n]*g
mix=mix/max(1.0,np.abs(mix).max()/0.89); wavfile.write('/tmp/claude-0/-home-user-nitron/c6fb1f40-1783-58cd-9184-37ffc939aff0/scratchpad/hk_'+opt+'.wav',SR,mix)
subprocess.run(['ffmpeg','-v','error','-y','-framerate','30','-start_number','0','-i',f'{FR}/%05d.jpg','-i','/tmp/claude-0/-home-user-nitron/c6fb1f40-1783-58cd-9184-37ffc939aff0/scratchpad/hk_'+opt+'.wav',
    '-t',str(DUR),'-vf','noise=alls=4:allf=t,format=yuv420p','-c:v','libx264','-crf','17','-preset','slow','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest',OUT],check=True)
print('preview',opt,OUT)
