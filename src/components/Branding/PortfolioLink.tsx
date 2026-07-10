import { PORTFOLIO_URL } from '../../lib/constants';

export function PortfolioLink() {
  return (
    <a
      href={PORTFOLIO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-slate-400 hover:text-[--color-forge-purple] transition-colors"
    >
      by Noemi Marcolini
    </a>
  );
}
