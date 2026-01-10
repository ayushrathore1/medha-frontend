/**
 * Animation Registry
 * Central export for all concept animations
 * Each animation file exports metadata and AnimationSteps array
 */

// Import animations as they are created
import * as HalfAdderAnimation from './HalfAdderAnimation';
import * as CppTemplatesAnimation from './CppTemplatesAnimation';
import * as Unit5OneShotAnimation from './Unit5OneShotAnimation';
// import * as FullAdderAnimation from './FullAdderAnimation';
// Add more imports as animations are created

// Registry of all available animations
// Maps animationId to the animation module
const animationRegistry = {
  'half-adder': HalfAdderAnimation,
  'cpp-templates': CppTemplatesAnimation,
  'unit5-oneshot': Unit5OneShotAnimation,
  // 'full-adder': FullAdderAnimation,
  // Add more animations here
};

/**
 * Get animation by ID
 * @param {string} animationId - The unique animation identifier
 * @returns {Object|null} Animation module with metadata and steps
 */
export const getAnimation = (animationId) => {
  return animationRegistry[animationId] || null;
};

/**
 * Get list of all available animations
 * @returns {Array} Array of animation metadata objects
 */
export const getAllAnimations = () => {
  return Object.entries(animationRegistry).map(([id, module]) => ({
    id,
    ...module.metadata
  }));
};

/**
 * Check if an animation exists
 * @param {string} animationId - The unique animation identifier
 * @returns {boolean}
 */
export const hasAnimation = (animationId) => {
  return animationId in animationRegistry;
};

export default animationRegistry;
