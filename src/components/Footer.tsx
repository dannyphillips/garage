interface FooterProps {
  domain: string;
  subdomain: string;
}

export function Footer({ domain, subdomain }: FooterProps) {
  const garageUrl = `https://${subdomain}.${domain}`;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>
          Garage lives at{' '}
          <a href={garageUrl}>{subdomain}.{domain}</a> — your internal App Store
          for everything on {domain}.
        </p>
        <p className="footer-note">
          Provision apps with <code>garage new-app &lt;slug&gt;</code>. Apps in
          this repo use <code>apps/*/garage.manifest.json</code>; external apps
          live in <code>garage/external.json</code>.
        </p>
      </div>
    </footer>
  );
}
