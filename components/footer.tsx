export function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-4 py-8 md:h-20 md:flex-row md:justify-between md:py-0">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Dawar Azhar. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/dawarazhar11"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/dawarazhar/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:hello@dawarazhar.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}