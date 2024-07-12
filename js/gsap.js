gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".intro-number").forEach((panel, i) => {
    ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: "+=1000",
        pin: true,
        scrub: 0.5,
        pinSpacing: false,
    });
});

gsap.to("#section3 .two__intro .two__number img", {
    xPercent: 200,
    ease: "none",
    scrollTrigger: {
        trigger: "#section3",
        start: "top top",
        end: "bottom top",
        scrub: true,
    }
});

gsap.utils.toArray(".text-top").forEach((panel, i) => {
    ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: "+=1000",
        pin: true,
        scrub: 0.5,
        pinSpacing: false,

    })
})

gsap.utils.toArray(".project__title").forEach((panel, i) => {
    ScrollTrigger.create({
        trigger: panel,
        start: "-=60",
        endTrigger: ".bgWrap",
        end: "bottom center",
        pin: true,
        scrub: 0.5,
        markers: true,
        pinSpacing: true,
    })
})


gsap.utils.toArray(".project__title2").forEach((panel, i) => {
    ScrollTrigger.create({
        trigger: panel,
        start: "-=60",
        endTrigger: ".bgWrap2",
        end: "bottom center",
        pin: true,
        scrub: 0.5,
        markers: true,
        pinSpacing: true,
    })
})