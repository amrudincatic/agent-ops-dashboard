export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 pb-10">
      <div className="flex flex-col items-center justify-between gap-2 border-t border-hairline pt-6 text-sm text-muted sm:flex-row">
        <p>Example project for demonstration purposes only. All data shown is simulated.</p>
        <p>
          Built by{' '}
          <a
            href="https://amrudincatic.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline decoration-hairline underline-offset-4 transition-colors hover:text-brand"
          >
            Amrudin Catic
          </a>
        </p>
      </div>
    </footer>
  );
}
