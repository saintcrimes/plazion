import React from 'react';
import { ArrowDown, ArrowRight, Cpu, Layers3, Recycle, Sigma } from 'lucide-react';

const copy = {
  en: {
    eyebrow: 'ENGINEERING / TECHNICAL DEEP DIVE', title: 'The science behind cleaner air.',
    intro: 'From particle capture to adaptive power control. Explore the physical principles and proposed architecture of the PLAZION system.',
    open: 'Explore scientific & engineering architecture', hint: '04 chapters · equations · control architecture',
    titles: ['Multistage air purification', 'Mathematical modeling & capture physics', 'Closed-loop AI & adaptive PID modulation', 'Industrial aerodynamics & circular byproducts'],
    paragraphs: [
      ['An aerodynamic inlet diffuser distributes contaminated exhaust across sequential treatment chambers. A non-thermal plasma (NTP) reactor generates reactive species, including hydroxyl radicals and ozone, to promote oxidation of gaseous contaminants. Gas-specific conversion and reaction products require validation for the selected exhaust composition; the proposed operating envelope includes duct velocities up to 10 m/s.', 'An electrostatic precipitator (ESP) then collects charged particles, including PM₂.₅ and PM₁₀ fractions. Dislodged solids enter a sealed bottom hopper, while a final high-efficiency media stage captures residual fine particles. The proposed system targets overall pollutant abatement above 95%, subject to pollutant-specific testing.'],
      ['Electrostatic collection is estimated using the Deutsch–Anderson relation. Collector area, particle migration velocity and volumetric flow determine the predicted collection efficiency. This idealized model assumes a representative migration velocity and uniform flow; actual performance also depends on particle size, charging and re-entrainment.', 'Particle drift follows a balance between electrostatic force and Stokes drag. Darcy–Weisbach estimates straight-duct friction loss; fittings and treatment modules add separate pressure losses that must be included when sizing the fan.'],
      ['The proposed sensor array tracks inlet and outlet PM₂.₅, PM₁₀, SO₂, NO₂ and CO, together with temperature, humidity and air velocity. The supervisory AI layer uses concentration trends (dC/dt) to select a plasma-power setpoint. A PID loop then regulates the high-voltage supply through high-frequency pulse-width modulation (PWM).', 'When measured pollutant removal falls below the 95% design target, the controller increases power within operating limits. During lighter emission loads, it reduces output. A 25–30% reduction in specific energy consumption is a project target, requiring comparison against a defined baseline under equivalent conditions.'],
      ['The architecture is intended for continuous-duty applications such as brick and lime kilns, commercial greenhouses and manufacturing exhaust systems. Automatic collector cleaning transfers dry solids into a sealed hopper to limit re-entrainment and support maintenance.', 'Recovered material may be suitable for secondary aggregate or other manufacturing inputs, depending on composition and acceptance criteria. Reuse requires characterization of the collected solids. Secure IoT telemetry is planned to relay operating conditions, equipment health and estimated captured mass to environmental reporting platforms.']
    ],
    flow: ['Diffuser', 'NTP reactor', 'ESP collector', 'Fine filtration'],
    loop: ['Inlet / outlet sensors', 'AI setpoint', 'PID → PWM', 'HV plasma supply'], feedback: 'Outlet measurements → removal feedback → setpoint adjustment',
    formulaLabels: ['Collection efficiency', 'Electric field & particle drift', 'Duct pressure loss', 'PID power regulation', 'Specific energy consumption'],
    definitions: ['A: collector area (m²) · w: migration velocity (m/s) · Q: volumetric flow (m³/s). Convert Q from m³/h by dividing by 3,600.', 'q: particle charge (C) · E: field strength (V/m) · μ: dynamic viscosity (Pa·s) · dₚ: particle diameter (m). Stokes regime; submicron particles may require a slip correction.', 'f: Darcy friction factor · L: duct length (m) · D: hydraulic diameter (m) · ρ: air density (kg/m³) · v: air velocity (m/s).', 'e(t): setpoint minus measured output · Kₚ, Kᵢ, K𝒹: controller gains · u(t): control command.', 'With P in kW and Q in m³/h, SEC is expressed in kWh/m³. Fan power also depends on total pressure loss and fan efficiency.'],
    note: 'Engineering basis: conceptual architecture and project targets. The equations describe design principles; they do not establish field performance or certified emissions compliance.',
    circular: ['Collect', 'Characterize', 'Assess reuse'],
  },
  ru: {
    eyebrow: 'ИНЖЕНЕРИЯ / ТЕХНИЧЕСКИЙ ОБЗОР', title: 'Наука на службе чистого воздуха.',
    intro: 'От улавливания частиц до адаптивного управления мощностью. Физические принципы и предлагаемая архитектура PLAZION.',
    open: 'Научная и инженерная архитектура', hint: '04 раздела · формулы · схема управления',
    titles: ['Многоступенчатая очистка воздуха', 'Математическая модель и физика улавливания', 'Замкнутый контур ИИ и адаптивное ПИД-управление', 'Промышленная аэродинамика и вторичное сырьё'],
    paragraphs: [
      ['Входной аэродинамический диффузор распределяет загрязнённый поток по камерам обработки. Реактор нетермической плазмы (NTP) создаёт активные частицы, включая гидроксильные радикалы и озон, для окисления газообразных загрязнителей. Степень превращения каждого газа и продукты реакции требуют проверки для конкретного состава выбросов. Предлагаемый диапазон включает скорости в канале до 10 м/с.', 'Затем электростатический осадитель (ESP) улавливает заряженные частицы, включая фракции PM₂.₅ и PM₁₀. Отделённые твёрдые вещества поступают в герметичный нижний бункер, а финишный высокоэффективный фильтр задерживает остаточные мелкие частицы. Проектная цель — очистка свыше 95%, с проверкой по каждому загрязнителю.'],
      ['Эффективность электростатического улавливания оценивается уравнением Дойча–Андерсона. Прогноз зависит от площади осаждения, скорости дрейфа и объёмного расхода. Идеализированная модель предполагает равномерный поток и характерную скорость миграции; фактический результат также зависит от размеров частиц, зарядки и повторного уноса.', 'Скорость дрейфа определяется балансом электрической силы и сопротивления Стокса. Уравнение Дарси–Вейсбаха оценивает потери на трение в прямом канале. При подборе вентилятора отдельно учитываются местные сопротивления и потери в модулях очистки.'],
      ['Предлагаемый комплекс датчиков измеряет PM₂.₅, PM₁₀, SO₂, NO₂ и CO до и после очистки, а также температуру, влажность и скорость воздуха. ИИ анализирует изменение концентрации (dC/dt) и задаёт целевую мощность плазмы. ПИД-регулятор управляет высоковольтным источником через высокочастотную широтно-импульсную модуляцию (ШИМ).', 'При снижении измеренной очистки ниже проектной цели 95% контроллер повышает мощность в допустимых пределах. При меньшей нагрузке мощность снижается. Снижение удельного энергопотребления на 25–30% — проектная цель, требующая сравнения с определённой базовой системой в сопоставимых условиях.'],
      ['Архитектура рассчитана на непрерывную работу с выбросами кирпичных и известковых печей, коммерческих теплиц и промышленных производств. Автоматическая очистка электродов направляет сухие частицы в герметичный бункер, ограничивая повторный унос и упрощая обслуживание.', 'Возможность использования осадка как вторичного заполнителя или производственного сырья зависит от состава и требований к материалу. Перед повторным использованием необходим анализ. Защищённая IoT-телеметрия предусматривает передачу рабочих параметров, состояния оборудования и расчётной массы уловленных веществ в системы экологической отчётности.']
    ],
    flow: ['Диффузор', 'NTP-реактор', 'ESP-осадитель', 'Тонкая очистка'],
    loop: ['Датчики входа / выхода', 'Уставка ИИ', 'ПИД → ШИМ', 'Питание плазмы'], feedback: 'Измерения на выходе → обратная связь по очистке → коррекция уставки',
    formulaLabels: ['Эффективность улавливания', 'Электрическое поле и дрейф частиц', 'Потери давления в канале', 'ПИД-регулирование мощности', 'Удельное энергопотребление'],
    definitions: ['A: площадь осаждения (м²) · w: скорость дрейфа (м/с) · Q: расход (м³/с). Для перевода из м³/ч разделите расход на 3 600.', 'q: заряд частицы (Кл) · E: напряжённость поля (В/м) · μ: динамическая вязкость (Па·с) · dₚ: диаметр частицы (м). Режим Стокса; для субмикронных частиц может потребоваться поправка на скольжение.', 'f: коэффициент трения Дарси · L: длина (м) · D: гидравлический диаметр (м) · ρ: плотность воздуха (кг/м³) · v: скорость (м/с).', 'e(t): разность уставки и измеренного выхода · Kₚ, Kᵢ, K𝒹: коэффициенты регулятора · u(t): управляющий сигнал.', 'При P в кВт и Q в м³/ч единица SEC — кВт·ч/м³. Мощность вентилятора также зависит от суммарных потерь давления и КПД.'],
    note: 'Инженерная основа: концептуальная архитектура и проектные цели. Формулы описывают принципы расчёта, а не подтверждённые эксплуатационные показатели или сертификацию выбросов.',
    circular: ['Сбор', 'Анализ состава', 'Оценка применения'],
  },
  uz: {
    eyebrow: 'MUHANDISLIK / TEXNIK TAFSILOTLAR', title: 'Toza havo ortidagi ilm-fan.',
    intro: 'Zarrachalarni tutishdan quvvatni moslashuvchan boshqarishgacha. PLAZION tizimining fizik tamoyillari va taklif etilgan arxitekturasi.',
    open: 'Ilmiy va muhandislik arxitekturasi', hint: '04 bo‘lim · formulalar · boshqaruv sxemasi',
    titles: ['Ko‘p bosqichli havo tozalash', 'Matematik model va tutish fizikasi', 'Yopiq konturli AI va moslashuvchan PID boshqaruvi', 'Sanoat aerodinamikasi va ikkilamchi xomashyo'],
    paragraphs: [
      ['Aerodinamik kirish diffuzori ifloslangan oqimni ishlov berish kameralariga bir tekis taqsimlaydi. Notermik plazma (NTP) reaktori gazsimon ifloslantiruvchilarni oksidlash uchun gidroksil radikallari va ozon kabi faol zarrachalarni hosil qiladi. Har bir gazning o‘zgarishi va reaksiya mahsulotlari aniq chiqindi tarkibi uchun tekshirilishi kerak. Taklif etilgan ish diapazoni kanalda 10 m/s gacha tezlikni qamrab oladi.', 'Keyingi elektrostatik cho‘ktirgich (ESP) zaryadlangan zarrachalarni, jumladan PM₂.₅ va PM₁₀ fraksiyalarini tutadi. Ajratilgan qattiq moddalar germetik pastki bunkerga tushadi; yakuniy yuqori samarali filtr qolgan mayda zarrachalarni ushlaydi. Umumiy tozalashning loyiha maqsadi 95% dan yuqori bo‘lib, har bir ifloslantiruvchi bo‘yicha sinovni talab qiladi.'],
      ['Elektrostatik tutish samaradorligi Deutsch–Anderson tenglamasi bilan baholanadi. Prognoz kollektor yuzasi, zarracha migratsiya tezligi va hajmiy sarfga bog‘liq. Ideal model bir tekis oqim va xarakterli migratsiya tezligini faraz qiladi; amaliy natija zarracha o‘lchami, zaryadlanish va qayta ko‘tarilishga ham bog‘liq.', 'Dreyf tezligi elektrostatik kuch va Stoks qarshiligi muvozanatidan aniqlanadi. Darcy–Weisbach tenglamasi to‘g‘ri kanaldagi ishqalanish yo‘qotishini baholaydi. Ventilyator tanlashda burilishlar va tozalash modullaridagi qo‘shimcha bosim yo‘qotishlari ham hisobga olinadi.'],
      ['Taklif etilgan datchiklar tizimi kirish va chiqishdagi PM₂.₅, PM₁₀, SO₂, NO₂ va CO ni, shuningdek harorat, namlik va havo tezligini kuzatadi. AI qatlami konsentratsiya o‘zgarishidan (dC/dt) plazma quvvati topshirig‘ini belgilaydi. PID konturi yuqori chastotali impuls kengligi modulyatsiyasi (PWM) orqali yuqori kuchlanish manbasini boshqaradi.', 'O‘lchangan tozalash darajasi 95% loyiha maqsadidan pastga tushsa, kontroller ruxsat etilgan chegaralarda quvvatni oshiradi. Yuklama pasayganda quvvat kamayadi. Solishtirma energiya sarfini 25–30% kamaytirish loyiha maqsadi bo‘lib, bir xil sharoitda belgilangan bazaviy tizim bilan taqqoslashni talab qiladi.'],
      ['Arxitektura g‘isht va ohak pechlari, tijorat issiqxonalari va ishlab chiqarish chiqindilarini uzluksiz tozalash uchun mo‘ljallangan. Kollektorlarni avtomatik tozalash quruq moddalarni germetik bunkerga yo‘naltirib, qayta tarqalishni cheklaydi va texnik xizmatni yengillashtiradi.', 'Yig‘ilgan moddani ikkilamchi to‘ldiruvchi yoki ishlab chiqarish xomashyosi sifatida ishlatish uning tarkibi va qabul mezonlariga bog‘liq. Qayta foydalanishdan oldin tarkibni tekshirish zarur. Himoyalangan IoT telemetriyasi ish parametrlari, uskuna holati va tutilgan moddalarning hisoblangan massasini ekologik hisobot platformalariga uzatishi rejalashtirilgan.']
    ],
    flow: ['Diffuzor', 'NTP reaktori', 'ESP kollektori', 'Yakuniy filtr'],
    loop: ['Kirish / chiqish datchiklari', 'AI topshirig‘i', 'PID → PWM', 'Plazma quvvat manbasi'], feedback: 'Chiqish o‘lchovlari → tozalash bo‘yicha qayta aloqa → topshiriqni sozlash',
    formulaLabels: ['Tutish samaradorligi', 'Elektr maydoni va zarracha dreyfi', 'Kanaldagi bosim yo‘qotishi', 'PID quvvat boshqaruvi', 'Solishtirma energiya sarfi'],
    definitions: ['A: kollektor yuzasi (m²) · w: migratsiya tezligi (m/s) · Q: hajmiy sarf (m³/s). m³/h dan o‘tkazish uchun 3 600 ga bo‘ling.', 'q: zarracha zaryadi (C) · E: maydon kuchlanganligi (V/m) · μ: dinamik qovushqoqlik (Pa·s) · dₚ: zarracha diametri (m). Stoks rejimi; submikron zarrachalar uchun sirpanish tuzatmasi zarur bo‘lishi mumkin.', 'f: Darcy ishqalanish koeffitsiyenti · L: uzunlik (m) · D: gidravlik diametr (m) · ρ: havo zichligi (kg/m³) · v: tezlik (m/s).', 'e(t): topshiriq va o‘lchangan chiqish farqi · Kₚ, Kᵢ, K𝒹: regulyator koeffitsiyentlari · u(t): boshqaruv signali.', 'P kW va Q m³/h da bo‘lsa, SEC birligi kWh/m³ bo‘ladi. Ventilyator quvvati umumiy bosim yo‘qotishi va foydali ish koeffitsiyentiga ham bog‘liq.'],
    note: 'Muhandislik asosi: konseptual arxitektura va loyiha maqsadlari. Tenglamalar hisoblash tamoyillarini ifodalaydi; ular amaliy samaradorlik yoki chiqindilar sertifikatini tasdiqlamaydi.',
    circular: ['Yig‘ish', 'Tarkibni tekshirish', 'Qayta foydalanishni baholash'],
  },
};

function Flow({ labels }) {
  return <ol className="engineering-flow">{labels.map((label, i) => <li key={label}><span className="mono">0{i + 1}</span><strong>{label}</strong>{i < labels.length - 1 && <ArrowRight size={16} aria-hidden="true" />}</li>)}</ol>;
}

function Formula({ index, t, children }) {
  return <figure className="engineering-formula"><figcaption>{t.formulaLabels[index]}</figcaption><div className="engineering-equation">{children}</div><p>{t.definitions[index]}</p></figure>;
}

export default function Engineering({ language }) {
  const t = copy[language] || copy.en;
  const icons = [Layers3, Sigma, Cpu, Recycle];
  return <section className="engineering section-space container" id="engineering" aria-labelledby="engineering-title">
    <div className="engineering-heading"><div><p className="eyebrow"><span />{t.eyebrow}</p><h2 id="engineering-title">{t.title}</h2></div><p className="section-description">{t.intro}</p></div>
    <details className="engineering-details"><summary><span><strong>{t.open}</strong><small>{t.hint}</small></span><span className="engineering-expand"><ArrowDown size={22} /></span></summary>
      <div className="engineering-chapters">{t.titles.map((title, i) => { const Icon = icons[i]; return <article className="engineering-chapter" key={title}>
        <div className="engineering-chapter-title"><span className="engineering-chapter-icon"><Icon size={22} strokeWidth={1.5} /></span><span className="mono">0{i + 1} /</span><h3>{title}</h3></div>
        <div className="engineering-chapter-body"><div className="engineering-prose">{t.paragraphs[i].map(p => <p key={p}>{p}</p>)}</div>
          <div className="engineering-evidence">
            {i === 0 && <Flow labels={t.flow} />}
            {i === 1 && <><Formula index={0} t={t}>η = 1 − exp(−Aw/Q)</Formula><Formula index={1} t={t}>E = V/d<br />w = qE/(3πμdₚ)</Formula><Formula index={2} t={t}>ΔP = f(L/D)(ρv²/2)</Formula></>}
            {i === 2 && <><div className="engineering-control"><Flow labels={t.loop} /><p className="engineering-feedback">↳ {t.feedback} ↲</p></div><Formula index={3} t={t}>u(t) = Kₚe(t) + Kᵢ∫e(τ)dτ + K𝒹 de(t)/dt</Formula><Formula index={4} t={t}>SEC = P/Q</Formula></>}
            {i === 3 && <Flow labels={t.circular} />}
          </div>
        </div>
      </article>; })}<p className="engineering-note">{t.note}</p></div>
    </details>
  </section>;
}
