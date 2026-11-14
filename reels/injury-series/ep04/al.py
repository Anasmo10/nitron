import sys, json
sys.path.insert(0,'/home/user/work')
from ctc import logits
from align import align
T={'7444':'هذا اللاعب ممكن يكون أنهى مسيرته بسبب غلطة كبيرة بتمرين الشولدر برس',
'7455':'بالحقيقة هون غلطتين الأولى إنه اختار وزن عالي بالنسبة للتمرين والتانية لما رفع رسغه مال لبرا فصار في ضغط على الساعد مما أدى لكسر بعظام الساعد',
'7460':'هذه الإصابة ستتطلب جبيرة وللأسف العلاج يستمر لست أشهر والعودة للتمرين بتكون تحت إشراف الطبيب',
'7461':'وآخر شي تذكر الوزن الذي يمكنك رفعه ليس ضروري يكون الوزن الذي يمكنك تتحكم فيه بأمان'}
out={}
for k,t in T.items():
    lg,fd=logits(f'IMG_{k}.wav'); w,sc=align(lg,fd,t.split()); out[k]=w
    print(k,'score/word %.1f'%(sc/len(w)),'|',' '.join(f'{a}[{s:.2f}-{e:.2f}]' for a,s,e in w))
json.dump(out,open('/home/user/work/ep4/words.json','w'),ensure_ascii=False,indent=1)
