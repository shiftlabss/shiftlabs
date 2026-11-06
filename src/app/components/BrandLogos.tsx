import svgPaths from "../../imports/svg-pgtixnbxan";

export function MenuxLogo() {
  return (
    <div className="h-[24px] w-[106px] relative shrink-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 105.917 23.9812">
        <g>
          <path d={svgPaths.p3b36b400} fill="#101700" />
          <path d={svgPaths.p3d25e5c0} fill="#101700" />
          <path d={svgPaths.p3f4cd840} fill="#101700" />
          <path d={svgPaths.p37b04500} fill="#101700" />
          <path d={svgPaths.p4eeca80} fill="#101700" />
          <path d={svgPaths.p2c063100} fill="#101700" />
          <path d={svgPaths.p1671f300} fill="#101700" />
          <path d={svgPaths.p2652e500} fill="#101700" />
          <path d={svgPaths.p3155d500} fill="#101700" />
        </g>
      </svg>
    </div>
  );
}

function BrandImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="relative shrink-0" style={{ width, height }}>
      <img src={src} alt={alt} width={width} height={height} className="block size-full" />
    </div>
  );
}

export function CortexLogo() {
  return (
    <BrandImage src="/brand-logos/logo-cortex.svg" alt="Cortex" width={88} height={28} />
  );
}

export function ConttoLogo() {
  return (
    <BrandImage src="/brand-logos/logo-contto.svg" alt="Contto" width={99} height={25} />
  );
}

export function RepasseSeguroLogo() {
  return (
    <BrandImage
      src="/brand-logos/logo-repasse-seguro.svg"
      alt="Repasse Seguro"
      width={94}
      height={30}
    />
  );
}
