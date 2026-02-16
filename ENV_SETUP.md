# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables. All variables should be prefixed with `NEXT_PUBLIC_` to be accessible in the client-side code.

## Required Variables

```env
# Portfolio Configuration
NEXT_PUBLIC_PORTFOLIO_NAME=John Doe
NEXT_PUBLIC_PORTFOLIO_TITLE=Full Stack Developer
NEXT_PUBLIC_PORTFOLIO_SUBTITLE=Building amazing digital experiences
NEXT_PUBLIC_PORTFOLIO_DESCRIPTION=I'm a passionate developer who loves creating beautiful and functional web applications. With expertise in modern web technologies, I bring ideas to life.
NEXT_PUBLIC_PORTFOLIO_EMAIL=john.doe@example.com
NEXT_PUBLIC_PORTFOLIO_PHONE=+1 (555) 123-4567
NEXT_PUBLIC_PORTFOLIO_LOCATION=San Francisco, CA
NEXT_PUBLIC_PORTFOLIO_GITHUB=https://github.com/johndoe
NEXT_PUBLIC_PORTFOLIO_LINKEDIN=https://linkedin.com/in/johndoe
NEXT_PUBLIC_PORTFOLIO_TWITTER=https://twitter.com/johndoe
NEXT_PUBLIC_PORTFOLIO_WEBSITE=https://johndoe.dev

# Skills (comma-separated)
NEXT_PUBLIC_PORTFOLIO_SKILLS=React,Next.js,TypeScript,Node.js,Python,Tailwind CSS

# Projects (JSON format - each project has: title, description, tech, link, github)
NEXT_PUBLIC_PORTFOLIO_PROJECTS=[{"title":"E-Commerce Platform","description":"A full-stack e-commerce solution with payment integration","tech":"Next.js, Stripe, MongoDB","link":"https://example.com","github":"https://github.com/johndoe/ecommerce"},{"title":"Task Management App","description":"Collaborative task management with real-time updates","tech":"React, Firebase, Tailwind","link":"https://example.com","github":"https://github.com/johndoe/tasks"},{"title":"Weather Dashboard","description":"Beautiful weather dashboard with location-based forecasts","tech":"Vue.js, OpenWeather API","link":"https://example.com","github":"https://github.com/johndoe/weather"}]

# Experience (JSON format)
NEXT_PUBLIC_PORTFOLIO_EXPERIENCE=[{"company":"Tech Corp","position":"Senior Developer","duration":"2022 - Present","description":"Leading development of scalable web applications"},{"company":"StartupXYZ","position":"Full Stack Developer","duration":"2020 - 2022","description":"Built and maintained multiple client projects"}]

# Education (JSON format)
NEXT_PUBLIC_PORTFOLIO_EDUCATION=[{"institution":"University of Technology","degree":"BS Computer Science","year":"2020"}]
```

## Notes

- All variables must be prefixed with `NEXT_PUBLIC_` to be accessible in client components
- If variables are not set, the portfolio will use fallback content
- JSON arrays should be properly formatted (no line breaks in the JSON string)
- Skills should be comma-separated without spaces after commas (or with spaces, the code will trim them)

