# Image Optimizer

A Fullstack Web app built with Next.js for compressing and optimizing images. <br>
**<a href="https://image-optimizer-online.vercel.app/">Live Demo</a>**

<p align="center">
    <img src="./public/images/upload.webp" alt="Upload Screen" style="max-width: 700px; width: 100%; height: auto;">
    <img src="./public/images/edit.webp" alt="Editing View" style="max-width: 700px; width: 100%; height: auto;">

</p>

# Tech Stack

<p align="center">
    <img src="https://simpleicons.org/icons/nextdotjs.svg" alt="Next.js" width="150px" style="filter: brightness(0) invert(1);">
    <img src="https://simpleicons.org/icons/react.svg" alt="React" width="150px" style="filter: brightness(0) invert(1);">
    <img src="https://simpleicons.org/icons/tailwindcss.svg" alt="TailwindCSS" width="150px" style="filter: brightness(0) invert(1);">
    <img src="https://simpleicons.org/icons/shadcnui.svg" alt="Shadcn" width="150px" style="filter: brightness(0) invert(1);">
    <img src="https://simpleicons.org/icons/sharp.svg" alt="Sharp" width="150px" style="filter: brightness(0) invert(1);">
</p>

**Framework:** Next.js 16.2 (App Router) <br>
**Frontend:** React, TailwindCSS, Shadcn/ui <br>
**Image Processing:** Sharp library <br>

# Features

## Drag-and-Drop Interface

Easily upload images either by dragging and dropping or by selecting an image from your device.

<p align="center">
    <img src="./public/images/upload.webp" alt="Upload Screen" style="max-width: 700px; width: 100%; height: auto;">
    <img src="./public/images/drag-and-drop.png" alt="Drag-and-Drop" style="max-width: 700px; width: 100%; height: auto;">
</p>

## Format Conversion

Convert your image to modern, optimized formats like _WebP_ (recommended), _AVIF_ _JPG_ or _PNG_.

<p align="center">
    <img src="./public/images/filetype-conversion.webp" alt="File Type Conversion" style="max-width: 700px; width: 100%; height: auto;">
</p>

### Supported Formats

#### Input Formats

- JPG/JPEG
- PNG
- WebP
- GIF
- AVIF
- TIFF
- SVG

#### Output Formats

- JPG/JPEG
- PNG
- WebP
- GIF
- AVIF
- TIFF

## Quality Controls

Adjust the image's quality to decrease the file size by up to 90% (best results with WebP and AVIF).

<p align="center">
    <img src="./public/images/quality-slider.webp" alt="Quality Slider" style="max-width: 700px; width: 100%; height: auto;">
</p>

## Live Before/After Comparison

An interactive diff image preview to check the image's quality after compression.

<p align="center">
    <img src="./public/images/diff-viewer.webp" alt="Diff Viewer" style="max-width: 700px; width: 100%; height: auto;">
</p>

## Real-time File Size Comparison

Check the optimized size easily without needing to download.

<p align="center">
    <img src="./public/images/filesize-comparison.webp" alt="File Size Comparison" style="max-width: 700px; width: 100%; height: auto;">
</p>

# Why I Built This

I wanted to build an image optimization tool with a clean UI and high compression efficiency while learning more about file handling and image processing in modern web applications.

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/raptorassassin/image-optimizer.git
cd image-optimizer
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

---

Open <a href="http://localhost:3000">http://localhost:3000</a> in your browser.

# Credits

- Sharp
- Shadcn
- React Diff Viewer
