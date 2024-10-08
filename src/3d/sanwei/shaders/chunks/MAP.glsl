float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec2 map(vec2 value, vec2 min1, vec2 max1, vec2 min2, vec2 max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}