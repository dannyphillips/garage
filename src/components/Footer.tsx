interface FooterProps {
  domain: string;
  subdomain: string;
}

export function Footer({ domain, subdomain }: FooterProps) {
  return (
    <footer className="store-footer">
      <div className="store-footer-inner">
        <p>
          <strong>Garage</strong> · Where ideas start
        </p>
        <p className="store-footer-sub">
          Personal apps by Danny Phillips ·{' '}
          <a href={`https://${subdomain}.${domain}`}>
            {subdomain}.{domain}
          </a>
        </p>
      </div>
    </footer>
  );
}
