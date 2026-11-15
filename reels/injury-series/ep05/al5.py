import sys, json
sys.path.insert(0,'/home/user/work')
from ctc import logits
from align import align
T={'7462':'ثلثين الإصابات اللي بتوصل للإسعاف بتكون لأنه الوزن وقع على صاحبه',
'7463':'هذا الشي إله عدة أسباب ممكن يكون الشخص استعمل السويسايد غريب ممكن يكون الرسغ ضعيف وما تحمل الوزن وأحيانا ممكن تكون القبضة زلقة',
'7472':'لذا قبل التمرين تتأكد إنه القبضة صحيحة ويدك ناشفة',
'7474':'وأكيد لازم يكون في معك حدا أثناء التمرين وإذا بدك حماية أكبر فيك تستعين بمشد المعصم',
'7478':'احمي حالك قبل أن تصير من الثلثين'}
out={}
for k,t in T.items():
    lg,fd=logits(f'IMG_{k}.wav'); w,sc=align(lg,fd,t.split()); out[k]=w
    print(k,'score/word %.1f'%(sc/len(w)),'|',' '.join(f'{a}[{s:.2f}-{e:.2f}]' for a,s,e in w))
json.dump(out,open('/home/user/work/ep5/words.json','w'),ensure_ascii=False,indent=1)
