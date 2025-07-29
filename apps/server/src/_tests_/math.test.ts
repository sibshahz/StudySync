import { add } from "./math";
describe("math utils", () => {
  it("adds two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
  it("adds positive and negative numbers", () => {
    expect(add(5, -3)).toBe(2);
    expect(add(-3, 5)).toBe(2);
  });
  it("adds negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  });
  it("adds zero", () => {
    expect(add(0, 5)).toBe(5);
    expect(add(5, 0)).toBe(5);
  });
});
