// Framer Motion's full feature set including layout animations. Only the
// skills grid needs layout animations (items glide to new slots when the
// filter changes, and the active pill slides via layoutId), so it loads this
// on demand instead of every visitor paying for it up front.
import { domMax } from "framer-motion";

export default domMax;
