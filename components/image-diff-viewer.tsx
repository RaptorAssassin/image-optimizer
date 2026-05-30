"use client"
import React from "react"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider"

type ImageDiffViewerProps = {
  beforeSrc: string
  afterSrc: string
  alt?: string
  className?: string
}

export default function ImageDiffViewer({
  beforeSrc,
  afterSrc,
  alt = "",
  className = "",
}: ImageDiffViewerProps) {
  if (!beforeSrc || !afterSrc) return null

  return (
    <div className={`w-full max-w-full ${className}`}>
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeSrc}
            alt={alt ? `${alt} — before` : "before"}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterSrc}
            alt={alt ? `${alt} — after` : "after"}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        }
        handle={<ReactCompareSliderHandle />}
      />
    </div>
  )
}
