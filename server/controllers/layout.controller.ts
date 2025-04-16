import { NextFunction, Request, Response } from "express"
import { ErrorHandler } from "../utils/ErrorHandler"
import cloudinary from "cloudinary"
import { Layout } from "../models/layout.model"

// create layout 
export const createLayout =
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await Layout.findOne({ type })
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exist`, 400))
      }
      if (type === "Banner") {
        const { image, title, subTitle } = req.body
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: "layout"
        })
        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url
            },
            title,
            subTitle
          }
        }
        await Layout.create(banner);
      }
      if (type === "FAQ") {
        const { faq } = req.body
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer
            }
          })
        )
        await Layout.create({ type: "FAQ", faq: faqItems })
      }
      if (type === "Categories") {
        const { categories } = req.body
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title
            }
          })
        )
        await Layout.create({ type: "Categories", categories: categoriesItems })
      }
      res.status(200).json({
        success: true,
        message: "Layout created successfully"
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }


// edit layout
export const editLayout =
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await Layout.findOne({ type: "Banner" })
        const { image, title, subTitle } = req.body

        const data = image.startsWith("https")
          ? bannerData
          : await cloudinary.v2.uploader.upload(image, {
            folder: "layout"
          })

        const banner = {
          type: "Banner",
          image: {
            public_id: image.startsWith("https")
              ? bannerData.banner.image.public_id
              : data?.public_id,
            url: image.startsWith("https")
              ? bannerData.banner.image.url
              : data?.secure_url
          },
          title,
          subTitle
        }

        await Layout.findByIdAndUpdate(bannerData._id, { banner });
      }
      if (type === "FAQ") {
        const { faq } = req.body
        const FaqItem = await Layout.findOne({ type: "FAQ" })
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer
            }
          })
        )
        await Layout.findByIdAndUpdate(FaqItem?._id, { type: "FAQ", faq: faqItems })
      }
      if (type === "Categories") {
        const { categories } = req.body
        const CategoriesItem = await Layout.findOne({ type: "Categories" })
        const categoriesItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title
            }
          })
        )
        await Layout.findByIdAndUpdate(CategoriesItem?._id, { type: "Categories", categories: categoriesItems })
      }
      res.status(200).json({
        success: true,
        message: "Layout updated successfully"
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }


// get layout by type
export const getLayoutByType =
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params
    const layout = await Layout.findOne({ type })
    try {
      res.status(200).json({
        success: true,
        layout
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  }
