<template>
  <!-- Outer wrapper of the image -->
  <div
    class="fantasiaMascotImage"
  >
    <!-- Inner image of the chosen Fantasia Mascot -->
    <img
      :src="currentMascotImage"
      class="fantasiaMascotImage__inner"
      data-test="fantasiaMascotImage-image"
      :data-test-image="fantasiaImage"
      :data-test-is-random="isRandom"
    >
  </div>
</template>

<script setup lang="ts">

/**
 * A list of all Fantasia mascot images currently avaiable
 */
const fantasiaImageList: { [key: string]: string } = {
  didYouKnow: 'images/fantasiaMascot/fantasia_didYouKnow.png',
  flop: 'images/fantasiaMascot/fantasia_flop.png',
  hug: 'images/fantasiaMascot/fantasia_hug.png',
  reading: 'images/fantasiaMascot/fantasia_reading.png',
  cooking: 'images/fantasiaMascot/fantasia_cooking.png',
  error: 'images/fantasiaMascot/fantasia_error.png'
}

/**
 * All component props
 */
const props = defineProps({
  /**
    * Name of the object key from the list to render. Leave empty in order to generate random image.
    * Available ones:
    * - didYouKnow
    * - flop
    * - hug
    * - reading
    * - cooking
    * - error
    */
  fantasiaImage: {
    type: String,
    default: ''
  },

  /**
   * Custom CSS string for the "height" attribute.
   */
  height: {
    type: String,
    default: 'initial'
  },

  /**
   * Custom CSS string for the "width" attribute.
   */
  width: {
    type: String,
    default: 'initial'
  }
})

/**
 * Determines if the image URL will be generating randomly or if it is set via the prop.
 */
const isRandom = ((imageUrl: string) => (imageUrl === ''))(props.fantasiaImage)

/**
 * Get a random image URL from the whole list of all available images
 */
const randomMascotImage = (list: { [key: string]: string }) => {
  // Cryptic code from SO: https://stackoverflow.com/a/15106541
  const keys = Object.keys(list)
  return list[keys[keys.length * Math.random() << 0]]
}

/**
 * Determine what current URL link we will be rendering.
 * If a specific image URL if one is chosen, otherwise return a random image URL.
 */
const determineCurrentImage = (list: { [key: string]: string }) => {
  if (isRandom) {
    return randomMascotImage(list)
  } else {
    return list[props.fantasiaImage]
  }
}

/**
 * Currently selected image URL for rendering
 */
const currentMascotImage = determineCurrentImage(fantasiaImageList)

</script>

<style lang="scss" scoped>

.fantasiaMascotImage {
  &__inner {
    height: v-bind(height);
    width: v-bind(width);
    user-select: none;
  }
}

</style>
