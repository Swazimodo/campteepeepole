test("Should pass", () => { });

test("Should throw", () => {
  const t = () => {
    throw new TypeError();
  };
  expect(t).toThrow(TypeError);
});