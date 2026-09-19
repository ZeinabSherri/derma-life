import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `BigText`.
 */
export type BigTextProps = SliceComponentProps<Content.BigTextSlice>;

/**
 * Component for "BigText" Slices.
 */
const BigText = ({ slice }: BigTextProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex h-screen w-screen items-center justify-center overflow-hidden bg-white text-[#2B302B]"
    >
      <h2 className="grid w-full gap-[2vh] text-center font-black uppercase leading-[.75]">
        <div className="text-[min(34vw,17vh)]">Science</div>
        <div className="grid gap-[2vh] text-[min(34vw,15vh)] md:flex md:justify-center md:gap-[2vw] md:text-[min(11vw,10vh)]">
          <span className="inline-block">that </span>
          <span className="inline-block max-md:text-[min(27vw,14vh)]">
            makes{" "}
          </span>
          <span className="inline-block max-md:text-[min(40vw,15vh)]">
            you{" "}
          </span>
        </div>
        <div className="text-[min(32vw,17vh)]">Beautiful</div>
      </h2>
    </section>
  );
};

export default BigText;
