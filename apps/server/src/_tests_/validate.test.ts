import { validate } from "@/middleware/validationMiddleware";
import { validationSchemas } from "@/utils/validation";

describe("validate middleware", () => {
  const mockReq = (body: any) => ({ body }) as any;
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  let mockNext: jest.Mock;

  beforeEach(() => {
    mockNext = jest.fn();
  });

  it("should respond with 400 for invalid register data", () => {
    const req = mockReq({
      name: "A", // too short
      email: "not-an-email", // invalid email
      password: "123", // too short
    });
    const res = mockRes();

    const middleware = validate("register");
    middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Validation failed",
        errors: expect.any(Array),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should respond with 500 if schema does not exist", () => {
    const req = mockReq({});
    const res = mockRes();

    const middleware = validate("nonexistent" as any);
    middleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation schema not found",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should pass for valid register data", () => {
    const req = mockReq({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    const res = mockRes();

    const middleware = validate("register");
    middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
