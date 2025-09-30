import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const UserController = {
  signIn: async ({
    body,
    jwt,
  }: {
    body: { username: string; password: string };
    jwt: any;
  }) => {
    try {
      const user = await prisma.user.findUnique({
        select: {
          id: true,
          username: true,
          level: true,
        },
        where: {
          username: body.username,
          password: body.password,
        },
      });
      if (!user) {
        return {
          status: 401,
          message: "Invalid username or password",
        };
      }
      const token = await jwt.sign(user);
      return { user, token };
    } catch (error) {
      return error;
    }
  },
  /////////// end of signIn ///////////
  update: async ({
    body,
    request,
    jwt,
  }: {
    body: {
      username: string;
      password: string;
    };
    request: any;
    jwt: any;
  }) => {
    try {
      const headers = request.headers.get("Authorization");
      const token = headers?.replace("Bearer ", "");

      const payload = await jwt.verify(token);

      const id = payload?.id;
      if (!id) {
        return {
          status: 401,
          message: "Invalid token",
        };
      }

      const oldUser = await prisma.user.findUnique({
        where: { id },
      });

      const newData = {
        username: body.username,
        password: body.password ?? oldUser?.password,
      };

      const updatedUser = await prisma.user.update({
        where: { id },
        data: newData,
      });

      return { message: "success" };
    } catch (error) {
      return error;
    }
  },
  /////////// end of update ///////////
};
