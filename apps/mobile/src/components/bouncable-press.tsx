import { type ComponentRef, forwardRef } from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { feedback } from "@/lib/feedback";

/** A semantic haptic intent from `@/lib/feedback`, fired on press-in. */
export type HapticIntent = keyof typeof feedback;

/**
 * A Pressable that springs down slightly on press and back on release. Drop-in for
 * Pressable; pass `bounce={false}` to fall back to a plain Pressable (e.g. for
 * rows where the scale would fight a parent animation).
 *
 * Pass `haptic="light" | "selection" | ...` to fire the matching `@/lib/feedback`
 * cue on press-in, in sync with the bounce — so call sites stay declarative
 * (`<BouncablePress haptic="selection">`) instead of wiring `onPressIn` by hand.
 * The haptic fires in both the bounce and `bounce={false}` variants; a disabled
 * Pressable never receives press events, so it neither bounces nor buzzes.
 */
export type BouncablePressProps = Omit<PressableProps, "style"> & {
  className?: string;
  bounce?: boolean;
  scaleIn?: number;
  scaleOut?: number;
  style?: StyleProp<ViewStyle>;
  haptic?: HapticIntent;
};

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

type BouncablePressRef = ComponentRef<typeof PressableAnimated>;

const AnimatedBouncablePress = forwardRef<BouncablePressRef, BouncablePressProps>(
  (
    {
      className = "",
      bounce: _bounce,
      scaleIn = 0.96,
      scaleOut = 1,
      style,
      haptic,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <PressableAnimated
        ref={ref}
        className={className}
        onPressIn={(event) => {
          scale.value = withSpring(scaleIn);
          if (haptic) feedback[haptic]();
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(scaleOut);
          onPressOut?.(event);
        }}
        style={[animatedStyle, style]}
        {...props}
      >
        {props.children}
      </PressableAnimated>
    );
  },
);

AnimatedBouncablePress.displayName = "AnimatedBouncablePress";

const PlainBouncablePress = forwardRef<BouncablePressRef, BouncablePressProps>(
  (
    {
      className = "",
      bounce: _bounce,
      scaleIn: _scaleIn,
      scaleOut: _scaleOut,
      style,
      haptic,
      onPressIn,
      ...props
    },
    ref,
  ) => (
    <Pressable
      ref={ref}
      className={className}
      style={style}
      onPressIn={(event) => {
        if (haptic) feedback[haptic]();
        onPressIn?.(event);
      }}
      {...props}
    >
      {props.children}
    </Pressable>
  ),
);

PlainBouncablePress.displayName = "PlainBouncablePress";

export const BouncablePress = forwardRef<BouncablePressRef, BouncablePressProps>(
  ({ bounce = true, ...props }, ref) =>
    bounce ? (
      <AnimatedBouncablePress ref={ref} {...props} />
    ) : (
      <PlainBouncablePress ref={ref} {...props} />
    ),
);

BouncablePress.displayName = "BouncablePress";
