// Pure CSS intro: rendered on the server so it paints with the first HTML and
// plays without waiting for hydration. An inline script in the root layout
// adds `intro-seen` to <html> on repeat visits in the same session, which
// skips it entirely (see globals.css). The name uses the system font rather
// than a web font: it paints in the first frame, before any web font can
// arrive, and a font swap there resized it mid-animation (layout shift).
export function IntroCurtain({ name }: { name: string }) {
    const letters = Array.from(name.toUpperCase());

    return (
        <div className="intro-curtain" aria-hidden="true">
            <div className="intro-panel intro-panel--top" />
            <div className="intro-panel intro-panel--bottom" />
            <div className="intro-mark">
                <div className="intro-name">
                    {letters.map((char, i) => (
                        <span key={i} className="intro-letter" style={{ ["--i" as string]: i }}>
                            {char === " " ? " " : char}
                        </span>
                    ))}
                </div>
                <div className="intro-progress" />
            </div>
        </div>
    );
}
