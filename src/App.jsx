import {
  ArrowRight,
  Box,
  CheckCircle2,
  CircuitBoard,
  Mail,
  Menu,
  MapPin,
  MonitorPlay,
  Phone,
  Play,
  X,
  RadioTower,
  Workflow,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import BorderGlow from './BorderGlow.jsx';
import ClickSpark from './ClickSpark.jsx';
import DotField from './DotField.jsx';

const navItems = [
  { label: '定位', href: '#profile' },
  { label: '能力', href: '#specialties' },
  { label: '案例', href: '#case-studies' },
  { label: '作品', href: '#works' },
  { label: '联系', href: '#contact' },
];

const metrics = [
  { value: '10', suffix: '年', label: '商业三维视觉服务经验' },
  { value: '76+', suffix: '', label: '产品、展厅与大屏项目经验' },
  { value: '14K', suffix: '', label: '超高分辨率展厅交付经验' },
  { value: 'AI+3D', suffix: '', label: 'AIGC 概念预演与三维制作' },
];

const projectFilters = [
  { id: 'all', label: '全部' },
  { id: 'product', label: '产品 / 科技' },
  { id: 'screen', label: '大屏 / 裸眼3D' },
  { id: 'auto', label: '汽车 / 工业' },
  { id: 'aigc', label: 'AIGC' },
];

const videoPath = (name) => `${import.meta.env.BASE_URL}assets/videos/optimized/${name}`;
const posterPath = (name) => `${import.meta.env.BASE_URL}assets/posters/${name.replace(/\.mp4$/, '.webp')}`;

const serviceTypes = [
  '产品发布三维动画',
  '汽车 / 工业产品演示',
  '展厅大屏循环视觉',
  '裸眼 3D / 异形屏适配',
  'AIGC 概念短片与提案预演',
];

const projectStages = [
  { step: '01', title: '需求拆解', text: '确认传播目标、受众、播放场景、规格、周期和预算，先形成清晰的制作边界。' },
  { step: '02', title: '分镜与风格', text: '将产品卖点、镜头节奏、视觉参考和实现路径整理成可评估的创意方案。' },
  { step: '03', title: '三维 / AIGC 制作', text: '根据确认方案完成资产整理、镜头动画、材质灯光、特效合成与必要的 AI 视觉预演。' },
  { step: '04', title: '交付适配', text: '按官网、发布会、展厅、超宽屏或裸眼 3D 场景输出可直接投放与播放的版本。' },
];

const caseStudies = [
  {
    title: '产品动画：GUB 骑行眼镜',
    tag: 'Product Launch',
    video: videoPath('product_gub_glasses.mp4'),
    challenge: '运动类产品需要在短时间里讲清结构、材质和科技感，不能只靠静态图。',
    role: '提供三维资产整理、材质灯光、镜头动画、字幕包装与最终成片输出。',
    outcome: '把产品卖点转化为 30 秒内可理解的视觉表达，适合电商、发布和品牌展示复用。',
  },
  {
    title: '展厅视觉：京东方超宽屏内容',
    tag: 'Exhibition Screen',
    video: videoPath('boe_exhibition_hall.mp4'),
    challenge: '京东方展厅项目需要在超宽屏比例里保持信息节奏、空间沉浸感和现场播放稳定性。',
    role: '提供视觉资产制作、镜头运动设计、屏幕比例适配与高规格文件交付。',
    outcome: '让三维内容可以在展厅大屏里稳定播放，并服务企业空间展示的科技调性。',
  },
  {
    title: 'AIGC 提案：BMW 概念镜头',
    tag: 'AI Concept',
    video: videoPath('aigc_bmw_concept.mp4'),
    challenge: '汽车概念提案需要快速呈现品牌气质、空间氛围和镜头冲击力，前期验证速度很关键。',
    role: '通过 AIGC 生成汽车概念镜头，并结合剪辑节奏、画面调性和三维审美判断完成提案预演。',
    outcome: '让客户在早期快速看见方向，降低试错成本，并为后续三维精制或广告分镜提供参考。',
  },
];

const projects = [
  {
    title: '综合作品快闪',
    type: 'Showreel',
    category: 'showreel',
    video: videoPath('hero_showreel.mp4'),
    summary: '快速展示产品动画、展厅视觉、AIGC 与 VFX 大屏方向，适合作为初步能力概览。',
    value: '让客户在一分钟内理解整体风格、项目跨度和交付能力。',
    featured: true,
  },
  {
    title: '芯片科技产品动画',
    type: 'Tech Product',
    category: 'product',
    video: videoPath('tech_chip.mp4'),
    summary: '围绕科技硬件的结构、光效、材质和品牌感建立高质感产品镜头。',
    value: '适合发布会、官网首屏、产品解释和科技品牌提案。',
  },
  {
    title: 'GUB 骑行眼镜产品动画',
    type: 'Product Animation',
    category: 'product',
    video: videoPath('product_gub_glasses.mp4'),
    summary: '通过材质灯光、镜头运动和功能细节，把产品从静态图转化为可传播内容。',
    value: '适合电商、社媒短片、新品发布和招商展示。',
  },
  {
    title: '全球科技标题包装',
    type: 'Title Package',
    category: 'product',
    video: videoPath('global_tech_title_package.mp4'),
    summary: '以地球、轨道光效和空间推进构建科技感主标题，强调信息开场的仪式感与国际化气质。',
    value: '适合科技发布会、企业宣传片片头、展厅序章和品牌主视觉开场。',
  },
  {
    title: '户外智能灭蚊设备动画',
    type: 'Premium Outdoor Device',
    category: 'product',
    video: videoPath('outdoor_mosquito_killer.mp4'),
    summary: '以克制的产品镜头呈现户外灭蚊设备的结构轮廓、夜间使用场景和智能化功能质感。',
    value: '适合高端户外家电、庭院生活方式品牌、发布会视觉和电商旗舰页展示。',
  },
  {
    title: '高端多功能宠物舱动画',
    type: 'Smart Pet Living',
    category: 'product',
    video: videoPath('premium_pet_cabin.mp4'),
    summary: '以高端家居语境呈现智能宠物舱的产品形态、舒适空间和多功能集成体验。',
    value: '适合高净值宠物用户、智能家居品牌、旗舰店详情页和新品发布视觉。',
  },
  {
    title: '工业产品动画',
    type: 'Industrial',
    category: 'auto',
    video: videoPath('industrial_product.mp4'),
    summary: '强调结构关系、机械运动逻辑和工业产品的可靠质感。',
    value: '适合设备演示、技术说明、展会循环播放和 B 端销售材料。',
  },
  {
    title: 'AMG 发动机舱渲染',
    type: 'Automotive',
    category: 'auto',
    video: videoPath('amg_engine.mp4'),
    summary: '用细节镜头强化机械结构、金属质感和汽车性能氛围。',
    value: '适合汽车品牌视觉、局部功能展示和高质感短片片段。',
  },
  {
    title: 'Porsche 车身光影大片',
    type: 'Automotive',
    category: 'auto',
    video: videoPath('porsche_render.mp4'),
    summary: '以车身曲面反射、低调灯光层次和镜头推进，建立高端跑车的产品气质。',
    value: '适合汽车品牌视觉提案、广告分镜预演和产品氛围片。',
  },
  {
    title: 'Porsche 运动姿态视觉',
    type: 'Automotive',
    category: 'auto',
    video: videoPath('porsche_render_3.mp4'),
    summary: '通过稳定的汽车渲染调性、镜头组织和材质控制，强化速度感与机械精密感。',
    value: '适合补充汽车方向的风格证明、品牌短片片段和社媒视觉资产。',
  },
  {
    title: '裸眼 3D 魔方屏幕',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_cube.mp4'),
    summary: '围绕出屏错觉、节奏卡点和大屏观看距离设计视觉内容。',
    value: '适合商场大屏、展厅入口、活动现场和异形屏展示。',
  },
  {
    title: '裸眼 3D 兵马俑视觉',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_terracotta.mp4'),
    summary: '将文化主题、空间纵深和出屏节奏结合，形成适合户外大屏观看的沉浸画面。',
    value: '适合文旅地标屏、城市商业大屏和文化主题活动视觉。',
  },
  {
    title: '裸眼 3D 汽车大屏',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_auto_screen.mp4'),
    summary: '围绕汽车主体的运动轨迹、透视冲击和屏幕边界关系设计出屏效果。',
    value: '适合汽车发布、商圈巨幕广告和品牌快闪活动。',
  },
  {
    title: '兵马俑 IP 大屏视觉',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_ip_terracotta.mp4'),
    summary: '以 IP 化角色表达文化符号，在大屏尺度中兼顾识别度、趣味性和视觉记忆点。',
    value: '适合文旅 IP 宣传、城市公共屏和活动主视觉延展。',
  },
  {
    title: '科技空间裸眼 3D',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_tech_screen.mp4'),
    summary: '用冷静的科技材质、空间结构和镜头层次，构建面向商业大屏的未来感视觉。',
    value: '适合科技品牌、企业展厅入口屏和发布会现场视觉。',
  },
  {
    title: '唐风仕女裸眼 3D',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_tang_lady.mp4'),
    summary: '以东方人物、衣袂动态和空间透视营造柔和但有冲击力的出屏叙事。',
    value: '适合文旅商业街区、节庆大屏和城市文化传播项目。',
  },
  {
    title: '自然树景大屏视觉',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_tree_scene.mp4'),
    summary: '用自然生长感、空间层次和环境光影，让大屏内容从装饰背景变成沉浸场景。',
    value: '适合商业空间氛围屏、生态主题展项和公共艺术视觉。',
  },
  {
    title: '京东方超宽屏展厅视觉',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('boe_exhibition_hall_2.mp4'),
    summary: '面向企业展厅超宽屏场景的沉浸式视觉内容，强化科技空间氛围与大屏节奏。',
    value: '适合展示展厅项目的系列化交付、屏幕适配和稳定落地能力。',
  },
  {
    title: '展厅 VFX 素材',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('exhibit_vfx.mp4'),
    summary: '用粒子、光效和运动节奏补充品牌空间的视觉层次。',
    value: '适合作为主视觉过场、开场包装或大屏背景。',
  },
  {
    title: '展厅抽象粒子 Logo',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('exhibit_particle_logo.mp4'),
    summary: '把品牌识别和粒子动态结合，形成空间里的记忆点。',
    value: '适合品牌露出、展厅片头和活动视觉转场。',
  },
  {
    title: '展厅粒子万花筒',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('exhibit_kaleidoscope.mp4'),
    summary: '偏抽象节奏与沉浸氛围的循环视觉内容。',
    value: '适合空间氛围、夜场屏幕和视觉背景。',
  },
  {
    title: '包装片头',
    type: 'Motion Package',
    category: 'screen',
    video: videoPath('package_opening.mp4'),
    summary: '面向栏目、活动或项目开场的动态图形包装。',
    value: '适合作为片头、品牌开场和项目视觉统一包装。',
  },
  {
    title: 'AIGC 越野车 V27',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_offroad.mp4'),
    summary: '用 AI 快速验证汽车概念的环境、氛围和镜头语言。',
    value: '适合提案阶段快速出方向，降低前期试错成本。',
  },
  {
    title: 'AIGC 马自达概念车',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_mazda.mp4'),
    summary: '以 AIGC 镜头探索汽车品牌调性和叙事节奏。',
    value: '适合概念预演、风格稿和客户沟通材料。',
  },
  {
    title: 'AIGC BMW 概念镜头',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_bmw_concept.mp4'),
    summary: '用 AI 快速建立汽车概念画面的品牌气质、空间关系和镜头运动方向。',
    value: '适合汽车广告提案、概念短片预演和前期风格验证。',
  },
  {
    title: 'AIGC 糖果广告概念片',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_office_transformation.mp4'),
    summary: '以日常办公场景切入，通过情绪反差、色彩转变和产品联想，快速搭建糖果广告片的创意方向。',
    value: '适合食品品牌广告提案、情绪化短片预演和社媒传播概念验证。',
  },
  {
    title: 'AIGC 文旅龙形开场',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_dragon_water_intro.mp4'),
    summary: '以龙形意象、水幕冲击和地方文化符号建立强开场，强化文旅宣传片的记忆点与地域气质。',
    value: '适合城市文旅宣传、景区推广片头、节庆活动开场和地方形象视觉提案。',
  },
];

const specialties = [
  {
    icon: Workflow,
    marker: '01 / Pipeline',
    title: '从概念到成片的完整交付',
    detail: '能把脚本拆解、分镜、三维资产、镜头动画、材质灯光、渲染合成和最终输出串成一条可执行流程。',
    proof: '适用于产品发布、工业演示、展厅循环片和品牌提案等需要稳定落地的商业项目。',
  },
  {
    icon: RadioTower,
    marker: '02 / Screen Delivery',
    title: '大屏、裸眼 3D 与展厅适配',
    detail: '熟悉超宽屏、360 度展厅、异形屏和裸眼 3D 的比例、视角、循环播放和现场交付逻辑。',
    proof: '曾参与京东方 360 度展厅等 14K 级别项目，具备高规格屏幕内容交付经验。',
  },
  {
    icon: Box,
    marker: '03 / Product Logic',
    title: '工业结构理解与产品表达',
    detail: '具备机械设计与产品结构理解基础，能将复杂结构、运动逻辑和产品卖点转化为清晰影像。',
    proof: '覆盖汽车、工业机械、科技硬件、骑行产品等需要结构说明与质感展示的方向。',
  },
  {
    icon: Zap,
    marker: '04 / VFX Tone',
    title: '粒子、动力学与商业审美',
    detail: '将 X-Particles、VDB、动力学、Mograph 和 AE 合成用于产品、舞美和品牌视觉，让画面更有能量和完成度。',
    proof: '可服务倒计时、消散、循环大屏、Logo 演绎、VJ 卡点和沉浸式视觉内容。',
  },
  {
    icon: CircuitBoard,
    marker: '05 / AI Workflow',
    title: 'AI 辅助提案与效率工作流',
    detail: '将 AI 工具与三维制作流程结合，用于脚本梳理、素材整理、风格探索和概念镜头预演。',
    proof: '可在项目前期更快形成方向参考，帮助客户降低沟通成本，并提升提案阶段的视觉确定性。',
  },
];

function ProjectPreview({ poster, src, title, eager = false }) {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return undefined;
    }

    if (eager && window.matchMedia('(min-width: 761px)').matches) {
      setShouldLoad(true);
      setHasLoaded(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setShouldLoad(isVisible);
        if (isVisible) {
          setHasLoaded(true);
        }
      },
      { rootMargin: '180px 0px', threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const syncPlayback = () => {
      if (!shouldLoad || document.hidden) {
        node.pause();
        return;
      }

      const playPromise = node.play();
      if (playPromise?.catch) playPromise.catch(() => {});
    };

    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => document.removeEventListener('visibilitychange', syncPlayback);
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      aria-label={title}
      loop
      muted
      playsInline
      poster={poster}
      preload={eager ? 'auto' : 'none'}
      src={hasLoaded ? src : undefined}
    />
  );
}

function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const visibleProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <ClickSpark
      duration={520}
      easing="ease-out"
      extraScale={1.08}
      sparkColor="#72ff82"
      sparkCount={10}
      sparkRadius={28}
      sparkSize={13}
    >
      <div className="site-shell">
        <DotField className="site-dot-field" />
        <header className={isMobileMenuOpen ? 'site-header is-menu-open' : 'site-header'}>
          <a className="brand" href="#top" aria-label="返回首页" onClick={closeMobileMenu}>
            <span className="brand-mark">H</span>
            <span className="brand-copy">
              <strong>HAWEO</strong>
              <small>Commercial 3D Motion</small>
            </span>
          </a>
          <nav className="site-nav" aria-label="主导航">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="nav-contact" href="mailto:522369446@qq.com">
            <Mail size={16} />
            <span>项目咨询</span>
          </a>
          <button
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            type="button"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <nav className="mobile-nav" aria-label="移动端导航">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMobileMenu}>
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <main id="top">
          <section className="hero" aria-label="首页">
            <ProjectPreview
              eager
              poster={posterPath('hero_showreel.mp4')}
              src={videoPath('hero_showreel.mp4')}
              title="HAWEO showreel"
            />
            <div className="hero-overlay" />
            <div className="hero-grid" />

            <div className="hero-inner">
              <div className="hero-copy">
                <p className="eyebrow">3D ANIMATION / AIGC / VFX / EXHIBITION VISUAL</p>
                <h1>HAWEO</h1>
                <p className="hero-lead">
                  为产品发布、展厅大屏、汽车与工业品牌制作可交付的 3D 动画与 AIGC 视觉内容。
                </p>
                <p className="hero-sublead">
                  从脚本分镜、三维制作、特效合成到超宽屏 / 裸眼 3D 适配，提供面向真实商业场景的完整落地流程。
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#case-studies">
                    <Play size={18} fill="currentColor" />
                    查看代表案例
                  </a>
                  <a className="button button-ghost" href="#contact">
                    讨论项目需求
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>

              <BorderGlow animated className="hero-panel" edgeSensitivity={22} fillOpacity={0.2} glowRadius={42}>
                <div>
                  <span>Current Focus</span>
                  <strong>AI assisted 3D pipeline</strong>
                </div>
                <div>
                  <span>Available For</span>
                  <strong>产品动画 / 裸眼3D / VFX大屏 / AIGC提案</strong>
                </div>
                <div>
                  <span>Base</span>
                  <strong>成都 · 远程协作 · 项目制交付</strong>
                </div>
              </BorderGlow>
            </div>
          </section>

          <section id="profile" className="section profile-section">
            <p className="section-kicker" aria-hidden="true">POSITIONING</p>
            <div className="section-inner profile-grid">
              <div className="portrait-frame" aria-label="作品动态预览">
                <ProjectPreview
                  poster={posterPath('portrait_motion.mp4')}
                  src={videoPath('portrait_motion.mp4')}
                  title="motion portrait"
                />
                <div className="portrait-caption">
                  <span>HAWEO</span>
                  <strong>Motion Portfolio</strong>
                </div>
              </div>

              <div className="profile-content">
                <p className="eyebrow">SERVICE POSITIONING</p>
                <h2>为产品发布、展厅大屏与品牌提案，提供可理解、可推进、可播放的三维视觉内容。</h2>
                <p className="section-copy">
                  服务覆盖三维动画、工业结构表达、AIGC 概念预演、VFX 特效与屏幕交付，
                  适用于产品发布、展厅大屏、汽车工业、科技硬件和品牌提案等需要稳定落地的商业项目。
                </p>
                <div className="service-list">
                  {serviceTypes.map((item) => (
                    <span key={item}>
                      <CheckCircle2 size={17} />
                      {item}
                    </span>
                  ))}
                </div>
                <div className="profile-meta">
                  <a href="tel:13084345226">
                    <Phone size={18} />
                    13084345226
                  </a>
                  <a href="mailto:522369446@qq.com">
                    <Mail size={18} />
                    522369446@qq.com
                  </a>
                  <span>
                    <MapPin size={18} />
                    成都 / 远程
                  </span>
                </div>
              </div>
            </div>

            <div className="section-inner metric-grid">
              {metrics.map((item) => (
                <BorderGlow className="metric-card" key={item.label}>
                  <strong>
                    {item.value}
                    <span>{item.suffix}</span>
                  </strong>
                  <p>{item.label}</p>
                </BorderGlow>
              ))}
            </div>
          </section>

          <section id="specialties" className="section specialties-section">
            <p className="section-kicker" aria-hidden="true">ADVANTAGES</p>
            <div className="section-inner">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">ADVANTAGES</p>
                  <h2>为什么选择 HAWEO</h2>
                </div>
                <p>
                  重点不只是制作画面，而是将创意方向、技术路径、项目周期、素材条件和最终播放场景整合成稳定交付。
                </p>
              </div>
              <div className="specialty-grid">
                {specialties.map((item) => {
                  const Icon = item.icon;
                  return (
                    <BorderGlow
                      className={item.marker === '05 / AI Workflow' ? 'specialty-card specialty-card-wide' : 'specialty-card'}
                      fillOpacity={0.22}
                      glowRadius={42}
                      key={item.title}
                    >
                      <div className="specialty-head">
                        <span className="specialty-icon">
                          <Icon size={22} />
                        </span>
                        <span>{item.marker}</span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                      <strong>{item.proof}</strong>
                    </BorderGlow>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="case-studies" className="section case-section">
            <p className="section-kicker" aria-hidden="true">CASES</p>
            <div className="section-inner">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">REPRESENTATIVE CASES</p>
                  <h2>三个方向，看见项目价值</h2>
                </div>
                <p>
                  每个案例不只展示画面，也说明客户场景、服务内容和最终可复用的商业价值。
                </p>
              </div>

              <div className="case-grid">
                {caseStudies.map((caseItem) => (
                  <BorderGlow className="case-card" fillOpacity={0.18} glowRadius={38} key={caseItem.title}>
                    <div className="case-media">
                      <ProjectPreview
                        poster={posterPath(caseItem.video.split('/').pop())}
                        src={caseItem.video}
                        title={caseItem.title}
                      />
                    </div>
                    <div className="case-content">
                      <span>{caseItem.tag}</span>
                      <h3>{caseItem.title}</h3>
                      <dl>
                        <div>
                          <dt>客户场景</dt>
                          <dd>{caseItem.challenge}</dd>
                        </div>
                        <div>
                          <dt>服务内容</dt>
                          <dd>{caseItem.role}</dd>
                        </div>
                        <div>
                          <dt>项目价值</dt>
                          <dd>{caseItem.outcome}</dd>
                        </div>
                      </dl>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </section>

          <section id="works" className="section works-section">
            <p className="section-kicker" aria-hidden="true">SELECTED WORKS</p>
            <div className="section-inner">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">SELECTED WORKS</p>
                  <h2>精选作品</h2>
                </div>
                <p>
                  动态预览结合应用场景说明，方便根据项目类型快速判断风格、规格与匹配度。
                </p>
              </div>

              <div className="filter-bar" aria-label="项目筛选">
                {projectFilters.map((filter) => (
                  <button
                    className={activeFilter === filter.id ? 'is-active' : ''}
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    type="button"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="project-grid">
                {visibleProjects.map((project) => (
                  <BorderGlow
                    className={project.featured ? 'project-card is-featured' : 'project-card'}
                    edgeSensitivity={24}
                    fillOpacity={0.18}
                    glowRadius={38}
                    key={project.title}
                  >
                    <div className="project-media">
                      <ProjectPreview
                        poster={posterPath(project.video.split('/').pop())}
                        src={project.video}
                        title={project.title}
                      />
                      <span className="play-chip">
                        <MonitorPlay size={16} />
                        Loop Preview
                      </span>
                    </div>
                    <div className="project-info">
                      <span>{project.type}</span>
                      <h3>{project.title}</h3>
                      <p>{project.summary}</p>
                      <strong>{project.value}</strong>
                    </div>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </section>

          <section className="section process-section">
            <p className="section-kicker" aria-hidden="true">WORKFLOW</p>
            <div className="section-inner">
              <div className="section-title-row">
                <div>
                  <p className="eyebrow">WORKFLOW</p>
                  <h2>合作流程更清楚，项目推进更顺</h2>
                </div>
                <p>
                  既可以从初步想法开始梳理，也可以在已有脚本、产品资料或展厅规格后直接进入制作。
                </p>
              </div>
              <div className="process-grid">
                {projectStages.map((stage) => (
                  <BorderGlow className="process-card" key={stage.step}>
                    <span>{stage.step}</span>
                    <h3>{stage.title}</h3>
                    <p>{stage.text}</p>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="contact-section">
            <p className="section-kicker" aria-hidden="true">CONTACT</p>
            <div className="contact-inner">
              <p className="eyebrow">CONTACT</p>
              <h2>把下一个视觉项目，推进为可落地的成片方案。</h2>
              <p>
                无论是产品动画、三维短片、AIGC 分镜、裸眼 3D、大屏循环视觉或展厅项目，都可以先从素材、周期和播放场景开始评估。
              </p>
              <div className="contact-actions">
                <a className="button button-primary" href="mailto:522369446@qq.com">
                  <Mail size={18} />
                  发送项目需求
                </a>
                <a className="button button-ghost" href="tel:13084345226">
                  <Phone size={18} />
                  13084345226
                </a>
              </div>
              <footer>
                <span>HAWEO</span>
                <span>3D Motion / AIGC / VFX</span>
              </footer>
            </div>
          </section>
        </main>
      </div>
    </ClickSpark>
  );
}

export default App;
