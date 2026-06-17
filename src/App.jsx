import {
  ArrowRight,
  Box,
  CircuitBoard,
  Mail,
  MapPin,
  MonitorPlay,
  Phone,
  Play,
  RadioTower,
  Workflow,
  Zap,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BorderGlow from './BorderGlow.jsx';
import ClickSpark from './ClickSpark.jsx';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: '优势', href: '#specialties' },
  { label: '项目', href: '#works' },
  { label: '联系', href: '#contact' },
];

const metrics = [
  { value: '10', suffix: '年', label: '商业视觉经验' },
  { value: '76+', suffix: '', label: '落地项目经验丰富' },
  { value: '14K', suffix: '', label: '超高分辨率展厅交付' },
  { value: '1200万+', suffix: '', label: '线下大屏覆盖人流' },
];

const projectFilters = [
  { id: 'all', label: '全部' },
  { id: 'product', label: '产品 / 科技' },
  { id: 'screen', label: '大屏 / 裸眼3D' },
  { id: 'auto', label: '汽车 / 工业' },
  { id: 'aigc', label: 'AIGC' },
];

const videoPath = (name) => `/assets/videos/optimized/${name}`;

const projects = [
  {
    title: '综合作品快闪',
    type: 'Showreel',
    category: 'screen',
    video: videoPath('hero_showreel.mp4'),
    summary: '作为首页主视觉，快速建立整体调性和作品广度。',
    featured: true,
  },
  {
    title: '芯片科技产品动画',
    type: 'Tech Product',
    category: 'product',
    video: videoPath('tech_chip.mp4'),
    summary: '使用你新整理的科技产品素材，突出结构、灯光和品牌科技感。',
  },
  {
    title: 'GUB 骑行眼镜产品动画',
    type: 'Product Animation',
    category: 'product',
    video: videoPath('product_gub_glasses.mp4'),
    summary: '运动眼镜类产品动画，突出产品结构、镜片质感与科技运动调性。',
  },
  {
    title: '工业产品动画',
    type: 'Industrial',
    category: 'auto',
    video: videoPath('industrial_product.mp4'),
    summary: '工业类产品的结构展示、运动逻辑和整体质感表达。',
  },
  {
    title: 'AMG 发动机舱渲染',
    type: 'Automotive',
    category: 'auto',
    video: videoPath('amg_engine.mp4'),
    summary: '偏结构展示和机械质感的汽车细节镜头。',
  },
  {
    title: 'Porsche 汽车渲染',
    type: 'Automotive',
    category: 'auto',
    video: videoPath('porsche_render.mp4'),
    summary: '高质感汽车产品渲染，强调灯光、曲面和材质控制。',
  },
  {
    title: 'Porsche 汽车渲染二',
    type: 'Automotive',
    category: 'auto',
    video: videoPath('porsche_render_2.mp4'),
    summary: '延续同系列调性，展示更多镜头节奏和车身细节。',
  },
  {
    title: 'Porsche 汽车渲染三',
    type: 'Automotive',
    category: 'auto',
    video: videoPath('porsche_render_3.mp4'),
    summary: '同系列补充镜头，更适合整体展示汽车类方向。',
  },
  {
    title: '裸眼 3D 魔方屏幕',
    type: 'Naked-eye 3D',
    category: 'screen',
    video: videoPath('naked_eye_cube.mp4'),
    summary: '适合大屏、展厅和异形视觉的裸眼 3D 表达。',
  },
  {
    title: '展厅循环素材',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('exhibit_loop.mp4'),
    summary: '展厅循环主视觉，偏稳重、克制的沉浸式氛围。',
  },
  {
    title: '展厅 VFX 素材',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('exhibit_vfx.mp4'),
    summary: '适合展厅与发布场景的视觉补充内容。',
  },
  {
    title: '展厅抽象粒子 Logo',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('exhibit_particle_logo.mp4'),
    summary: '粒子与品牌识别结合的过场视觉。',
  },
  {
    title: '展厅粒子万花筒',
    type: 'Exhibition Visual',
    category: 'screen',
    video: videoPath('exhibit_kaleidoscope.mp4'),
    summary: '更偏抽象节奏与空间氛围的视觉内容。',
  },
  {
    title: '包装片头',
    type: 'Motion Package',
    category: 'screen',
    video: videoPath('package_opening.mp4'),
    summary: '栏目或项目包装方向，偏开场和品牌氛围塑造。',
  },
  {
    title: 'AIGC 越野车 V27',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_offroad.mp4'),
    summary: 'AIGC 汽车概念方向，用于快速验证调性和镜头语言。',
  },
  {
    title: 'AIGC 马自达概念车',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_mazda.mp4'),
    summary: '概念车表达，适合提案和风格稿阶段。',
  },
  {
    title: 'AIGC 中世纪奇幻对决',
    type: 'AIGC Motion',
    category: 'aigc',
    video: videoPath('aigc_fantasy_duel.mp4'),
    summary: 'AIGC 概念镜头，强调风格探索和画面张力。',
  },
];

const specialties = [
  {
    icon: Workflow,
    marker: '01 / Pipeline',
    title: '全流程影像输出',
    detail: '从脚本拆解、资产搭建、镜头动画、材质灯光、渲染合成到最终剪辑输出，可以独立完成一条商业三维动画的完整生产链路。',
    proof: '产品动画、工业演示、文创宣传与提案详情页均有完整落地经验。',
  },
  {
    icon: Zap,
    marker: '02 / X-Particles',
    title: 'XP 粒子与特效融入流程',
    detail: '擅长将 X-Particles、VDB、动力学、Mograph 等效果纳入常规制作流程，让产品、舞美和大屏视觉拥有更强的能量感与高级调性。',
    proof: '覆盖粒子海洋、倒计时、消散、VJ 卡点循环和裸眼 3D 视觉。',
  },
  {
    icon: RadioTower,
    marker: '03 / Screen Delivery',
    title: '裸眼 3D 与超规格大屏交付',
    detail: '熟悉超宽屏、360 度展厅、异形屏和投射适配逻辑，能把三维内容按真实播放场景裁切、校正、优化并稳定交付。',
    proof: '曾参与京东方 360 度展厅等 14K 级别项目，负责核心资产、镜头与屏幕适配。',
  },
  {
    icon: Box,
    marker: '04 / Visual Tone',
    title: '工业逻辑与商业审美结合',
    detail: '机械设计背景让结构理解、模型优化和运动逻辑更扎实，同时通过 C4D、Redshift、Arnold、Octane 与 AE 合成控制画面质感。',
    proof: '在汽车、工业机械、科技产品与高保真个人渲染中持续强化调性控制。',
  },
  {
    icon: CircuitBoard,
    marker: '05 / AI Coding',
    title: 'AI Vibe Coding 与本地工作流搭建',
    detail: '持续把 Codex、Claude Code 等 AI coding 工具融入个人生产流程，用自然语言快速完成网站搭建、脚本辅助、素材整理和方案迭代。',
    proof: '本站即由 Codex 辅助完成 React + Vite 搭建；同时具备本地部署 ComfyUI、调试节点工作流并服务视觉资产生产的能力。',
  },
];

function ProjectPreview({ src, title }) {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nearViewport = entry.isIntersecting;
        setShouldLoad(nearViewport);
        setIsActive(nearViewport);
      },
      {
        rootMargin: '420px 0px',
        threshold: 0.01,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }

    if (isActive && shouldLoad) {
      const playPromise = node.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
      return;
    }

    node.pause();
    if (!shouldLoad) {
      node.removeAttribute('src');
      node.load();
    }
  }, [isActive, shouldLoad]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={title}
    />
  );
}

function App() {
  const appRef = useRef(null);
  const projectParallaxRef = useRef([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const visibleProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            '.opening-overlay',
            '.opening-mask',
            '.opening-word',
            '.opening-line',
            '.opening-meta',
            '.site-header',
            '.hero-video',
            '.hero-grid',
            '.hero .eyebrow',
            '.hero-title-wrap',
            '.hero-lead',
            '.hero-actions',
            '.hero-panel',
            '.section-kicker',
            '.section-title-row',
            '.profile-content > .eyebrow',
            '.profile-content h2',
            '.section-copy',
            '.profile-meta',
            '.contact-inner > *',
            '.motion-card',
            '.portrait-frame',
            '.project-media',
          ],
          { clearProps: 'all' },
        );
        gsap.set('.opening-overlay', { autoAlpha: 0, pointerEvents: 'none' });
        return;
      }

      gsap.set('.site-header', { y: -34, autoAlpha: 0 });
      gsap.set('.hero-video', { scale: 1.18, opacity: 0 });
      gsap.set('.hero-grid', { opacity: 0 });
      gsap.set('.hero .eyebrow', { yPercent: 110, autoAlpha: 0 });
      gsap.set('.hero-title-wrap', { clipPath: 'inset(0 100% 0 0)' });
      gsap.set('.hero h1', { xPercent: -10, scaleX: 0.64, transformOrigin: 'left center' });
      gsap.set(['.hero-lead', '.hero-actions', '.hero-panel'], { y: 54, autoAlpha: 0 });
      gsap.set('.opening-word', { yPercent: 130, scaleY: 1.35, transformOrigin: '50% 100%' });
      gsap.set('.opening-line', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.opening-meta', { y: 20, autoAlpha: 0 });

      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .to('.opening-word', {
          yPercent: 0,
          scaleY: 1,
          duration: 1.08,
          stagger: 0.12,
        })
        .to('.opening-line', { scaleX: 1, duration: 1.0 }, 0.2)
        .to('.opening-meta', { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 }, 0.5)
        .to('.opening-mask', { yPercent: -100, duration: 1.18, ease: 'power4.inOut' }, 1.32)
        .to('.opening-overlay', { autoAlpha: 0, pointerEvents: 'none', duration: 0.35 }, 2.18)
        .to('.hero-video', { scale: 1, opacity: 0.78, duration: 1.7 }, 1.34)
        .to('.hero-grid', { opacity: 0.42, duration: 1.2 }, 1.6)
        .to('.site-header', { y: 0, autoAlpha: 1, duration: 0.9 }, 1.76)
        .to('.hero .eyebrow', { yPercent: 0, autoAlpha: 1, duration: 0.9 }, 1.86)
        .to('.hero-title-wrap', { clipPath: 'inset(0 0% 0 0)', duration: 1.15, ease: 'power4.inOut' }, 1.96)
        .to('.hero h1', { xPercent: 0, scaleX: 1, duration: 1.28, ease: 'power4.out' }, 2.0)
        .to('.hero-lead', { y: 0, autoAlpha: 1, duration: 0.92 }, 2.42)
        .to('.hero-actions', { y: 0, autoAlpha: 1, duration: 0.88 }, 2.58)
        .to('.hero-panel', { y: 0, autoAlpha: 1, duration: 1.0 }, 2.72);

      gsap.utils.toArray('.motion-section').forEach((section) => {
        const owned = (selector) =>
          gsap.utils
            .toArray(section.querySelectorAll(selector))
            .filter((element) => element.closest('.motion-section') === section);
        const firstOwned = (selector) => owned(selector)[0];

        const kicker = firstOwned('.section-kicker');
        const titleRow = firstOwned('.section-title-row');
        const profileBits = owned('.profile-content > .eyebrow, .profile-content h2, .section-copy, .profile-meta');
        const cards = owned('.motion-card');
        const portrait = firstOwned('.portrait-frame');
        const media = owned('.project-media');
        const contactBits = owned('.contact-inner > *');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom 35%',
            toggleActions: 'play none none reverse',
          },
          defaults: { ease: 'power4.out' },
        });

        if (kicker) {
          gsap.set(kicker, { xPercent: -18, y: 80, scaleX: 1.35, autoAlpha: 0, transformOrigin: 'left center' });
          tl.to(kicker, { xPercent: 0, y: 0, scaleX: 1, autoAlpha: 1, duration: 1.25 }, 0);
        }

        if (titleRow) {
          gsap.set(titleRow, { y: 72, clipPath: 'inset(0 0 100% 0)', autoAlpha: 0 });
          tl.to(titleRow, { y: 0, clipPath: 'inset(0 0 0% 0)', autoAlpha: 1, duration: 1.05 }, 0.2);
        }

        if (profileBits.length) {
          gsap.set(profileBits, { y: 58, autoAlpha: 0 });
          tl.to(profileBits, { y: 0, autoAlpha: 1, duration: 0.95, stagger: 0.09 }, 0.18);
        }

        if (portrait) {
          gsap.set(portrait, { clipPath: 'inset(0 0 100% 0)', y: 80, scale: 1.06, autoAlpha: 0 });
          tl.to(portrait, { clipPath: 'inset(0 0 0% 0)', y: 0, scale: 1, autoAlpha: 1, duration: 1.2 }, 0.1);
        }

        if (cards.length) {
          gsap.set(cards, { y: 100, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' });
          tl.to(cards, {
            y: 0,
            autoAlpha: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.08,
            stagger: { each: 0.08, from: 'start' },
          }, 0.42);
        }

        if (media.length) {
          gsap.set(media, { clipPath: 'inset(100% 0 0 0)' });
          tl.to(media, {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.0,
            stagger: { each: 0.06, from: 'start' },
          }, 0.5);
        }

        if (contactBits.length) {
          gsap.set(contactBits, { y: 86, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' });
          tl.to(contactBits, {
            y: 0,
            autoAlpha: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.12,
            stagger: 0.12,
          }, 0.28);
        }
      });

    }, appRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!appRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = appRef.current.querySelectorAll('#works .project-card');

    projectParallaxRef.current.forEach((trigger) => trigger.kill());
    projectParallaxRef.current = [];

    if (!reduceMotion && cards.length) {
      gsap.fromTo(
        cards,
        { y: 42, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0,
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.82,
          ease: 'power4.out',
          stagger: { each: 0.045, from: 'start' },
          overwrite: 'auto',
        },
      );

      gsap.utils.toArray(appRef.current.querySelectorAll('#works .project-media video')).forEach((video) => {
        const tween = gsap.fromTo(
          video,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: video.closest('.project-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          },
        );

        if (tween.scrollTrigger) {
          projectParallaxRef.current.push(tween.scrollTrigger);
        }
      });
    }

    ScrollTrigger.refresh();

    return () => {
      projectParallaxRef.current.forEach((trigger) => trigger.kill());
      projectParallaxRef.current = [];
    };
  }, [activeFilter]);

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
      <div className="site-shell" ref={appRef}>
        <div className="opening-overlay" aria-hidden="true">
          <div className="opening-mask">
            <div className="opening-inner">
              <div className="opening-row">
                <span className="opening-word">HAWEO</span>
              </div>
              <div className="opening-line" />
              <div className="opening-meta">
                <span>3D MOTION DESIGNER</span>
                <span>AI / VFX / EXHIBITION VISUAL</span>
              </div>
            </div>
          </div>
        </div>

        <header className="site-header">
          <a className="brand" href="#top" aria-label="返回首页">
            <span className="brand-mark">H</span>
            <span className="brand-copy">
              <strong>HAWEO</strong>
              <small>3D Motion Designer</small>
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
            <span>联系合作</span>
          </a>
        </header>

        <main id="top">
        <section className="hero" aria-label="首页 Hero">
          <video
            className="hero-video"
            src={videoPath('hero_showreel.mp4')}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          <div className="hero-overlay" />
          <div className="hero-grid" />

          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">
                3D ANIMATION / AIGC / VFX / EXHIBITION VISUAL
              </p>
              <div className="hero-title-wrap">
                <h1>HAWEO</h1>
              </div>
              <p className="hero-lead">
                三维动画与实时视觉设计，面向产品发布、裸眼大屏、展厅影像和高质感商业短片。
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#works">
                  <Play size={18} fill="currentColor" />
                  查看精选项目
                </a>
                <a className="button button-ghost" href="#contact">
                  获取合作方式
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <BorderGlow
              aria-label="项目摘要"
              animated
              className="hero-panel"
              edgeSensitivity={22}
              fillOpacity={0.2}
              glowRadius={42}
            >
              <div>
                <span>Current Focus</span>
                <strong>AI assisted 3D pipeline</strong>
              </div>
              <div>
                <span>Available For</span>
                <strong>产品动画 / 裸眼3D / VFX大屏</strong>
              </div>
              <div>
                <span>Base</span>
                <strong>成都 · 远程协作</strong>
              </div>
            </BorderGlow>
          </div>
        </section>

        <section id="profile" className="section profile-section motion-section">
          <p className="section-kicker" aria-hidden="true">PROFILE</p>
          <div className="section-inner profile-grid">
            <div className="portrait-frame" aria-label="人物图占位">
              <div className="portrait-lines">
                <span />
                <span />
                <span />
              </div>
              <p>Portrait<br />Pending Upload</p>
            </div>

            <div className="profile-content">
              <p className="eyebrow">PROFILE</p>
              <h2>用工程逻辑做影像，用审美控制完成交付。</h2>
              <p className="section-copy">
                关于我：一名拥有 10 年商业视觉经验的三维设计师，长期服务于产品动画、HMI 动效、VJ 舞美大屏、裸眼 3D 展厅与 AIGC 视觉提案。工作方式强调从概念、资产、镜头、渲染、合成到屏幕适配的完整闭环，让复杂视觉在有限周期内稳定落地。
              </p>

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

              <div className="metric-grid">
                {metrics.map((item) => (
                  <BorderGlow className="metric-card motion-card" key={item.label}>
                    <strong>
                      {item.value}
                      <span>{item.suffix}</span>
                    </strong>
                    <p>{item.label}</p>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </div>

          <div id="specialties" className="section-inner experience-wrap motion-section motion-subsection">
            <p className="section-kicker" aria-hidden="true">ADVANTAGES</p>
            <div className="section-title-row">
              <div>
                <p className="eyebrow">ADVANTAGES</p>
                <h2>个人优势</h2>
              </div>
              <p>
                从经历里提炼出的核心优势：不是单纯会软件，而是能把创意、技术、渲染、特效和最终播放场景串成可交付的作品。
              </p>
            </div>
            <div className="specialty-grid">
              {specialties.map((item) => {
                const Icon = item.icon;
                return (
                  <BorderGlow
                    className={
                      item.marker === '05 / AI Coding'
                        ? 'specialty-card specialty-card-wide motion-card'
                        : 'specialty-card motion-card'
                    }
                    key={item.title}
                    glowRadius={42}
                    fillOpacity={0.22}
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

        <section id="works" className="section works-section motion-section">
          <p className="section-kicker" aria-hidden="true">SELECTED WORKS</p>
          <div className="section-inner">
            <div className="section-title-row">
              <div>
                <p className="eyebrow">SELECTED WORKS</p>
                <h2>精选项目</h2>
              </div>
              <p>
                卡片内使用轻量循环视频预览，保留动态效果，避免直接加载原始大文件。点击筛选可快速查看不同方向作品。
              </p>
            </div>

            <div className="filter-bar" aria-label="项目筛选">
              {projectFilters.map((filter) => (
                <button
                  className={activeFilter === filter.id ? 'is-active' : ''}
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="project-grid">
              {visibleProjects.map((project) => (
                <BorderGlow
                  className={project.featured ? 'project-card is-featured motion-card' : 'project-card motion-card'}
                  key={project.title}
                  edgeSensitivity={24}
                  fillOpacity={0.18}
                  glowRadius={38}
                >
                  <div className="project-media">
                    <ProjectPreview src={project.video} title={project.title} />
                    <span className="play-chip">
                      <MonitorPlay size={16} />
                      Loop Preview
                    </span>
                  </div>
                  <div className="project-info">
                    <span>{project.type}</span>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                  </div>
                </BorderGlow>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section motion-section">
          <p className="section-kicker" aria-hidden="true">CONTACT</p>
          <div className="contact-inner">
            <p className="eyebrow">CONTACT</p>
            <h2>把下一个镜头做成能交付的视觉资产。</h2>
            <p>
              产品动画、三维短片、AIGC 分镜、裸眼 3D、大屏循环视觉或展厅项目，都可以先从素材、周期和播放场景聊起。
            </p>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:522369446@qq.com">
                <Mail size={18} />
                发送邮件
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
