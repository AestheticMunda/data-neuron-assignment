// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../libs/prisma";

const actionCount = async (ipAddress: string, action: string) => {
  const result = await prisma.actionCount.findMany({
    where: {
      ipAddress,
      action
    }
  });
  console.log("resultttt=>", result.length)
  return result.length;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
 
  if(req.method === 'GET') {
    const clientIp = req.headers['x-forwarded-for'] ?? "127.0.0.1";
    const addCount = await actionCount(clientIp as string, "add");
    const updateCount = await actionCount(clientIp as string, "update");
    const tasks = await prisma.task.findMany();

    res.status(200).json({ tasks, addCount, updateCount, status: true });
  }
  if(req.method === 'POST') {
    const clientIp = req.headers['x-forwarded-for'] ?? "127.0.0.1";
    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        ipAddress: clientIp as string,
      }
    })
    const count = await prisma.actionCount.create({
      data: {
        action: "add",
        count: 1,
        ipAddress: clientIp as string,
      }
    })

    if(count) {
      res.status(200).json({ task, status: true });
    }
  }

  if(req.method === 'PUT') {
    const clientIp = req.headers['x-forwarded-for'] ?? "127.0.0.1";
    const task = await prisma.task.update({
      where: {
        id: req.body.id
      },
      data: {
        title: req.body.title
      }
    })
    const count = await prisma.actionCount.create({
      data: {
        action: "update",
        count: 1,
        ipAddress: clientIp as string,
      }
    })
    res.status(200).json({ task, status: true });
  }

  if(req.method === 'DELETE') {

    const task = await prisma.task.delete({
      where: {
        id: req.query.id as string,
      }
    })
    
    res.status(200).json({ task, status: true });
  }
}
