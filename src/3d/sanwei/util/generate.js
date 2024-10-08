import { DUMMY_VEC3 } from "./dummy";

export const getPointInSphere = (v3) => {
  var d, x, y, z;
  do {
    x = Math.random() * 2.0 - 1.0;
    y = Math.random() * 2.0 - 1.0;
    z = Math.random() * 2.0 - 1.0;
    d = x * x + y * y + z * z;
  } while (d > 1.0);

  v3.set(x, y, z);
};
