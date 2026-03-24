export default function WaveDivider({
  className = '',
  flip = false,
  fill = 'rgba(255, 255, 255, 0.38)',
}) {
  return (
    <div className={`pointer-events-none relative h-20 w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className={`h-full w-full ${flip ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={fill}
          d="M0,96L40,85.3C80,75,160,53,240,48C320,43,400,53,480,69.3C560,85,640,107,720,117.3C800,128,880,128,960,112C1040,96,1120,64,1200,58.7C1280,53,1360,75,1400,85.3L1440,96L1440,160L1400,160C1360,160,1280,160,1200,160C1120,160,1040,160,960,160C880,160,800,160,720,160C640,160,560,160,480,160C400,160,320,160,240,160C160,160,80,160,40,160L0,160Z"
        />
      </svg>
    </div>
  );
}
