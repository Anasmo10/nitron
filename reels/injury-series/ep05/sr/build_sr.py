"""Real-ESRGAN realesr-general-x4v3 (SRVGGNetCompact: 32 convs, PReLU, PixelShuffle ×4 + nearest skip) rebuilt as ONNX
from the official .pth without PyTorch (PyTorch cannot be installed here): the zip pickle is read with a small unpickler."""
import zipfile, pickle, io, collections, numpy as np, onnx
from onnx import helper, TensorProto, numpy_helper
P='/home/user/work/models/realesr-general-x4v3.pth'; z=zipfile.ZipFile(P); root=z.namelist()[0].split('/')[0]
DT={'FloatStorage':np.float32,'HalfStorage':np.float16,'LongStorage':np.int64,'IntStorage':np.int32}
class Store:
    def __init__(s,n): s.n=n
def rebuild(storage,offset,size,stride,*a):
    it=storage.itemsize; return np.lib.stride_tricks.as_strided(storage[offset:],shape=size,strides=[x*it for x in stride]).copy() if len(size) else storage[offset:offset+1].reshape(())
class U(pickle.Unpickler):
    def find_class(s,mod,name):
        if mod=='torch._utils' and name=='_rebuild_tensor_v2': return rebuild
        if mod=='torch' and name in DT: return Store(name)
        if mod=='collections' and name=='OrderedDict': return collections.OrderedDict
        return super().find_class(mod,name)
    def persistent_load(s,pid):
        _,st,key,loc,numel=pid; return np.frombuffer(z.read(f'{root}/data/{key}'),dtype=DT[st.n])
sd=U(io.BytesIO(z.read(f'{root}/data.pkl'))).load(); sd=sd.get('params',sd.get('params_ema',sd))
print(len(sd),'tensors', list(sd)[:4], sd['body.0.weight'].shape)
nodes=[]; inits=[]; cur='x'; i=0
idx=sorted({int(k.split('.')[1]) for k in sd})
for n in idx:
    w=sd[f'body.{n}.weight']
    if w.ndim==4:
        inits+= [numpy_helper.from_array(w.astype(np.float32),f'w{n}'), numpy_helper.from_array(sd[f'body.{n}.bias'].astype(np.float32),f'b{n}')]
        nodes.append(helper.make_node('Conv',[cur,f'w{n}',f'b{n}'],[f'c{n}'],pads=[1,1,1,1],kernel_shape=[3,3])); cur=f'c{n}'
    else:
        inits.append(numpy_helper.from_array(w.astype(np.float32).reshape(-1,1,1),f'p{n}'))
        nodes.append(helper.make_node('PRelu',[cur,f'p{n}'],[f'a{n}'])); cur=f'a{n}'
nodes.append(helper.make_node('DepthToSpace',[cur],['up'],blocksize=4,mode='CRD'))
inits.append(numpy_helper.from_array(np.array([1,1,4,4],np.float32),'scales'))
nodes.append(helper.make_node('Resize',['x','','scales'],['base'],mode='nearest'))
nodes.append(helper.make_node('Add',['up','base'],['y']))
g=helper.make_graph(nodes,'srvgg',[helper.make_tensor_value_info('x',TensorProto.FLOAT,[1,3,'H','W'])],[helper.make_tensor_value_info('y',TensorProto.FLOAT,[1,3,'H4','W4'])],inits)
m=helper.make_model(g,opset_imports=[helper.make_opsetid('',17)]); m.ir_version=8; onnx.checker.check_model(m); onnx.save(m,'/home/user/work/models/realesr-general-x4v3.onnx'); print('saved')
