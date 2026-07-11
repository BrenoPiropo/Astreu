// src/gallery/gallery.module.ts
import { Module } from "@nestjs/common";
import { GalleryController } from "./gallery.controller"; // <--- Caminho relativo correto

@Module({
  controllers: [GalleryController],
})
export class GalleryModule {}
