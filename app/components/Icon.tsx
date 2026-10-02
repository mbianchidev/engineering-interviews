import type { ComponentPropsWithoutRef, ReactNode } from 'react';

const paths = {
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  back: <path d="M19 12H5m6-6-6 6 6 6" />,
  diagonal: <path d="M6 18 18 6M6 6h12v12" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5" /></>,
  timer: <><circle cx="12" cy="13" r="8" /><path d="M9 2h6m-3 3v3m0 5 3-3m3-6 2 2" /></>,
  company: <><rect x="4" y="7" width="16" height="14" rx="2" /><path d="M9 7V3h6v4M9 11h1m4 0h1m-6 4h1m4 0h1m-4 6v-4h2v4" /></>,
  activity: <path d="M2 12h4l3-8 6 16 3-8h4" />,
  check: <path d="m5 12 4 4L19 6" />,
  spark: <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export default function Icon({ name, ...props }: ComponentPropsWithoutRef<'svg'> & { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
