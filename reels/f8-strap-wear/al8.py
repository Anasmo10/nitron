import sys, json, numpy as np
sys.path.insert(0,'/home/user/work')
from align import align
from ctc import logits
T={
 "c04":"إذا الفيجر ثمانية ستراب مو شادد صح الغلط غالبا باللبس مو بالستراب",
 "c02":"البس حلقة بإيدك مرر التانية من تحت البار والبسها بنفس الإيد وقبل ما تسكر إيدك ارفع الستراب لفوق تأكد إنه شادد عالبار",
 "c01":"إذا ما شد مو مشكلة برمه كم برمة قبل ما تلبس الحلقة التانية وهلق سكر إيدك والعب والستراب شادد بالشكل الصح",
 "c03":"طيب كيف منشده صح",
}
out={}
for c,txt in T.items():
    lg,fd=logits(f"wav/{c}.wav"); w=txt.split()
    res,score=align(lg,fd,w); out[c]=res
    print(c, round(score,1)); print("  "+"  ".join(f"{a}[{s:.2f}-{e:.2f}]" for a,s,e in res))
json.dump(out,open("words.json","w"),ensure_ascii=False,indent=0)
