function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
}

function toggleCheck(el) {
  const circle = el.querySelector('.check-circle');
  circle.classList.toggle('done');
  circle.textContent = circle.classList.contains('done') ? '✓' : '';
}

async function callClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!response.ok) throw new Error("API xatosi: " + response.status);
  const data = await response.json();
  return data.content.map(b => b.text || "").join("");
}

function renderText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^#{1,3} (.+)$/gm, '<br><strong style="font-size:14px;color:#f5a623">$1</strong><br>')
    .replace(/^- (.+)$/gm, '&nbsp;&nbsp;• $1')
    .replace(/\n/g, '<br>');
}

function getFormData(prefix) {
  const data = {};
  const els = document.querySelectorAll(`[id^="${prefix}-"]`);
  els.forEach(el => { data[el.id.replace(prefix + '-', '')] = el.value; });
  return data;
}

async function analyzePost() {
  const btn = document.getElementById('analyzeBtn');
  const resultDiv = document.getElementById('post-result');
  const resultText = document.getElementById('post-result-text');

  const type = document.getElementById('p-type').value;
  const niche = document.getElementById('p-niche').value || "noma'lum";
  const caption = document.getElementById('p-caption').value || "yo'q";
  const hashtags = document.getElementById('p-hashtags').value || "yo'q";
  const followers = document.getElementById('p-followers').value || '?';
  const views = document.getElementById('p-views').value || '?';
  const likes = document.getElementById('p-likes').value || '?';
  const comments = document.getElementById('p-comments').value || '?';
  const time = document.getElementById('p-time').value;
  const problem = document.getElementById('p-problem').value || '';

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>AI tahlil qilmoqda...';
  resultDiv.style.display = 'block';
  resultText.innerHTML = '<span style="color:var(--muted)">⏳ Tahlil yuklanmoqda...</span>';

  const prompt = `Sen Instagram eksperti va SMM mutaxassisisisan. Foydalanuvchining Instagram post ma'lumotlarini tahlil qil va o'zbek tilida javob ber.

POST MA'LUMOTLARI:
- Tur: ${type}
- Niche: ${niche}
- Caption: ${caption}
- Hashtaglar: ${hashtags}
- Followers: ${followers}
- Views/Impressions: ${views}
- Likes: ${likes}
- Comments: ${comments}
- Post vaqti: ${time}
- Muammo: ${problem}

Quyidagilarni tahlil qil va aniq maslahat ber:

**📊 ENGAGEMENT RATE TAHLILI**
Engagement rate hisoblash va baholash (yaxshi/o'rtacha/past)

**🔍 NIMA YAXSHI**
Bu postda nima to'g'ri qilingan

**⚠️ MUAMMOLAR**
Nima noto'g'ri, nima kamchilik

**💡 QANDAY YAXSHILASH MUMKIN**
Konkret 5 ta amaliy maslahat — views oshirish uchun

**📝 CAPTION TAHLILI**
Caption yaxshimi yomonmi, nima qo'shish kerak

**🔖 HASHTAG TAHLILI**
Hashtaglar to'g'rimi, qanday o'zgartirish kerak

**⏰ VAQT TAHLILI**
Post qilingan vaqt to'g'rimi

O'zbek tilida yoz, aniq va foydali bo'l.`;

  try {
    const result = await callClaude(prompt);
    resultText.innerHTML = renderText(result);
  } catch (e) {
    resultText.innerHTML = '<span style="color:#ff6b6b">❌ Xato: ' + e.message + '</span>';
  }
  btn.disabled = false;
  btn.innerHTML = '✦ AI Tahlil Qil';
}

async function generateCaption() {
  const btn = event.target;
  const topic = document.getElementById('c-topic').value;
  const niche = document.getElementById('c-niche').value || 'general';
  const tone = document.getElementById('c-tone').value;
  const lang = document.getElementById('c-lang').value;
  const cta = document.getElementById('c-cta').value;

  if (!topic) { alert("Post nima haqida ekanini kiriting!"); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Caption yozilmoqda...';

  const toneMap = { funny:'kulgili va casual', motivational:'motivatsion va kuchli', professional:'professional va jiddiy', storytelling:'hikoya uslubida', educational:"ta'limiy va informativ" };
  const ctaMap = { follow:'follow qilishga undash', comment:'comment yozishga undash', save:'postni save qilishga undash', share:"do'stlarga share qilishga undash", visit:"bio linkka o'tishga undash" };
  const langMap = { uz:"O'zbek tilida", en:'Ingliz tilida', mix:"O'zbek va ingliz aralash" };

  const prompt = `Sen Instagram caption yozuvchi ekspertsan. Viral, engagement oshiradigan caption yoz.

MAVZU: ${topic}
NICHE: ${niche}
TON: ${toneMap[tone]}
TIL: ${langMap[lang]}
CTA MAQSAD: ${ctaMap[cta]}

Shartlar:
- 150–300 so'z oralig'ida bo'lsin
- Hook bilan boshlang (1-2 qator e'tiborni tortsin)
- Emoji ishlatgin (ortiqcha emas, o'rinli)
- Oxirida savol bilan yakunla (comment oshirish uchun)
- CTA: ${ctaMap[cta]}
- Faqat caption yoz, tushuntirma qo'shma

Faqat captionni yoz, boshqa narsa yozma.`;

  const resultDiv = document.getElementById('caption-result');
  const captionText = document.getElementById('caption-text');
  resultDiv.style.display = 'block';
  captionText.innerHTML = '<span style="color:var(--muted)">✍️ Yozilmoqda...</span>';

  try {
    const result = await callClaude(prompt);
    captionText.innerHTML = renderText(result);
  } catch (e) {
    captionText.innerHTML = '<span style="color:#ff6b6b">❌ ' + e.message + '</span>';
  }
  btn.disabled = false;
  btn.innerHTML = '✦ Caption Yarat';
}

function copyCaption() {
  const text = document.getElementById('caption-text').innerText;
  navigator.clipboard.writeText(text);
  const btn = event.target;
  btn.textContent = '✅ Nusxa olindi';
  setTimeout(() => btn.textContent = 'Nusxa', 2000);
}

let generatedHashtags = [];

async function generateHashtags() {
  const btn = event.target;
  const topic = document.getElementById('h-topic').value;
  const niche = document.getElementById('h-niche').value || 'general';
  const audience = document.getElementById('h-audience').value;
  const type = document.getElementById('h-type').value;

  if (!topic && !niche) { alert("Kamida niche yoki mavzu kiriting!"); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Hashtaglar topilmoqda...';

  const audMap = { uz:"O'zbekiston auditoriyasi", global:'Global dunyo auditoriyasi', both:"Ham O'zbekiston, ham global" };

  const prompt = `Sen Instagram hashtag ekspertisan. Reach va views oshiradigan optimal hashtaglar ber.

MAVZU: ${topic}
NICHE: ${niche}
AUDITORIYA: ${audMap[audience]}
KONTENT TURI: ${type}

Quyidagi formatda JSON qaytargil — faqat JSON, boshqa narsa yozma:
{
  "small": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "medium": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10"],
  "large": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7"],
  "tips": "2-3 qator maslahat: qaysi hashtaglarni birinchi qo'yish kerak, qanday ishlatish kerak"
}

small = 10K-100K post bo'lgan (o'zbekcha yoki niche specific)
medium = 100K-1M post bo'lgan
large = 1M+ post bo'lgan (global)
# belgisini qo'shma, faqat so'zlarni yaz`;

  const resultDiv = document.getElementById('hashtag-result');
  const pillsDiv = document.getElementById('hashtag-pills');
  const tipsDiv = document.getElementById('hashtag-tips');
  resultDiv.style.display = 'block';
  pillsDiv.innerHTML = '<span style="color:var(--muted)">⏳ Yuklanmoqda...</span>';
  tipsDiv.innerHTML = '';

  try {
    const result = await callClaude(prompt);
    const clean = result.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    generatedHashtags = [...data.small, ...data.medium, ...data.large];
    pillsDiv.innerHTML = '';

    const categories = [
      { list: data.small, label: '🟢 Kichik', color: '#00e676' },
      { list: data.medium, label: "🟡 O'rta", color: '#f5a623' },
      { list: data.large, label: '🔴 Katta', color: '#e1306c' }
    ];

    categories.forEach(cat => {
      const header = document.createElement('div');
      header.style.cssText = 'width:100%; font-size:11px; color:' + cat.color + '; font-weight:600; margin:8px 0 4px; text-transform:uppercase; letter-spacing:0.5px;';
      header.textContent = cat.label;
      pillsDiv.appendChild(header);

      cat.list.forEach(tag => {
        const pill = document.createElement('span');
        pill.className = 'hashtag-pill';
        pill.textContent = '#' + tag;
        pill.onclick = () => {
          navigator.clipboard.writeText('#' + tag);
          pill.classList.add('copied');
          pill.textContent = '✓ ' + tag;
          setTimeout(() => {
            pill.classList.remove('copied');
            pill.textContent = '#' + tag;
          }, 1500);
        };
        pillsDiv.appendChild(pill);
      });
    });

    if (data.tips) {
      tipsDiv.innerHTML = '<div style="margin-top:12px; padding:12px; background:rgba(245,166,35,0.08); border:1px solid rgba(245,166,35,0.2); border-radius:10px; font-size:12px; color:#f5a623; line-height:1.7">💡 ' + renderText(data.tips) + '</div>';
    }
  } catch (e) {
    pillsDiv.innerHTML = '<span style="color:#ff6b6b">❌ ' + e.message + '</span>';
  }
  btn.disabled = false;
  btn.innerHTML = '✦ Hashtaglar Topish';
}

function copyAllHashtags() {
  const text = generatedHashtags.map(h => '#' + h).join(' ');
  navigator.clipboard.writeText(text);
  const btn = event.target;
  btn.textContent = '✅ Hammasi nusxa olindi!';
  setTimeout(() => btn.textContent = "📋 Barchasini ko'chirish", 2000);
}

async function fixReel() {
  const btn = event.target;
  const topic = document.getElementById('r-topic').value;
  const duration = document.getElementById('r-duration').value;
  const caption = document.getElementById('r-caption').value || "yo'q";
  const hashtags = document.getElementById('r-hashtags').value || "yo'q";
  const problem = document.getElementById('r-problem').value;
  const extra = document.getElementById('r-extra').value || '';

  if (!topic) { alert("Reel nima haqida ekanini kiriting!"); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Tahlil + tuzatish...';

  const resultDiv = document.getElementById('reel-result');
  const resultText = document.getElementById('reel-result-text');
  resultDiv.style.display = 'block';
  resultText.innerHTML = '<span style="color:var(--muted)">🎬 Tahlil qilinmoqda...</span>';

  const problemMap = {
    'low-views': "View/impression juda kam",
    'no-reach': "Faqat followers ko'ryapti, yangi odamlarga yetmayapti",
    'no-engagement': "Like va comment yo'q",
    'algorithm': "Instagram algorithm ko'rsatmayapti",
    'general': 'Umumiy yaxshilash'
  };

  const prompt = `Sen Instagram Reels eksperti va SMM mutaxassisisisan. Foydalanuvchining Reelini tahlil qil, muammolarini toping va to'liq yaxshilash rejasini ber.

REEL MA'LUMOTLARI:
- Mavzu: ${topic}
- Davomiylik: ${duration} soniya
- Hozirgi caption: ${caption}
- Hozirgi hashtaglar: ${hashtags}
- Asosiy muammo: ${problemMap[problem]}
- Qo'shimcha: ${extra}

O'zbek tilida quyidagilarni ber:

**🔍 MUAMMO TAHLILI**
Nima sababdan views/reach kam (aniq tushuntir)

**✏️ TUZATILGAN CAPTION**
To'liq yangi, yaxshi caption yoz (emoji bilan, savol bilan, CTA bilan)

**🔖 TO'G'RI HASHTAGLAR**
20 ta hashtag: har biri #hashtag formatida, qatorlarda guruhlarga ajrat

**🎬 REEL EDIT MASLAHATLARI**
- Hook qanday bo'lishi kerak (birinchi 3 soniya)
- Qanday edit qilish kerak (cut, text, audio)
- Cover thumbnail qanday bo'lsin
- Qanday audio ishlatish kerak

**📈 REACH OSHIRISH UCHUN**
Post qilgandan keyin nima qilish kerak (5 qadam)

O'zbek tilida yoz.`;

  try {
    const result = await callClaude(prompt);
    resultText.innerHTML = renderText(result);
  } catch (e) {
    resultText.innerHTML = '<span style="color:#ff6b6b">❌ ' + e.message + '</span>';
  }
  btn.disabled = false;
  btn.innerHTML = '✦ Reelni Tuzat + Yangi Caption & Hashtag';
}