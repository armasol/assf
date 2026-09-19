import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const });
export const HomeIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>;
export const SearchIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
export const CoinsIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><ellipse cx="8" cy="8" rx="5" ry="3"/><path d="M3 8v4c0 1.7 2.2 3 5 3 1.1 0 2-.2 2.8-.6"/><path d="M13 10c2.8 0 5 1.3 5 3s-2.2 3-5 3-5-1.3-5-3"/><path d="M8 13v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4"/></svg>;
export const ChartIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>;
export const RocketIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="M14 4c2.5-1.8 5.1-1.5 6-1.4.1.9.4 3.5-1.4 6l-5.5 5.5-4-4L14 4Z"/><path d="m9 10-4 1-2 2 5 1"/><path d="m14 15 1 5 2-2 1-4"/><circle cx="15.5" cy="7.5" r="1.5"/><path d="m6 17-2 3 3-2"/></svg>;
export const GiftIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18"/><path d="M12 8H7.5A2.5 2.5 0 1 1 10 5.5C10 7 12 8 12 8Z"/><path d="M12 8h4.5A2.5 2.5 0 1 0 14 5.5C14 7 12 8 12 8Z"/></svg>;
export const DocsIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></svg>;
export const WalletIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><path d="M14 11h6v4h-6a2 2 0 1 1 0-4Z"/></svg>;
export const ChevronIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="m9 18 6-6-6-6"/></svg>;
export const ArrowIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
export const CloseIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="m6 6 12 12M18 6 6 18"/></svg>;
export const UploadIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v5h16v-5"/></svg>;
export const CheckIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="m5 12 4 4L19 6"/></svg>;
export const SparkIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="m12 2 1.6 5.1L19 9l-5.4 1.9L12 16l-1.6-5.1L5 9l5.4-1.9L12 2Z"/><path d="m5 15 .8 2.4L8 18l-2.2.6L5 21l-.8-2.4L2 18l2.2-.6L5 15Z"/></svg>;
export const TwitchIcon = ({size=20,...p}:Props) => <svg {...base(size)} {...p}><path d="M4 3h17v12l-5 5h-4l-3 3v-3H4z"/><path d="M9 7v6M15 7v6"/></svg>;
