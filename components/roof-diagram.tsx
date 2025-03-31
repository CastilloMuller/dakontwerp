"use client"

import { useRef, useEffect } from "react"

interface RoofDiagramProps {
  width: number
  leftGutterHeight: number
  rightGutterHeight: number
  leftAngle: number
  rightAngle: number
  ridgeHeight: number
  ridgePosition: number
  leftWallHeight: number
  rightWallHeight: number
  leftRoofLength: number
  rightRoofLength: number
}

export default function RoofDiagram({
  width,
  leftGutterHeight,
  rightGutterHeight,
  leftAngle,
  rightAngle,
  ridgeHeight,
  ridgePosition,
  leftWallHeight,
  rightWallHeight,
  leftRoofLength,
  rightRoofLength,
}: RoofDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Fixed canvas dimensions
    const canvasWidth = 800
    const canvasHeight = 600
    
    // Calculate the maximum possible height the diagram could reach
    const maxPossibleHeight = Math.max(
      ridgeHeight,
      leftGutterHeight,
      rightGutterHeight
    ) * 1.2; // Add 20% buffer
    
    // Calculate the maximum possible width including any text labels
    const maxPossibleWidth = width * 1.2; // Add 20% buffer
    
    // IMPORTANT: Calculate scale factors for both dimensions
    const padding = 100; // Increased padding for safety
    const scaleX = (canvasWidth - padding * 2) / maxPossibleWidth;
    const scaleY = (canvasHeight - padding * 2) / maxPossibleHeight;
    
    // Use the smaller scale factor to ensure everything fits
    const fixedScale = Math.min(scaleX, scaleY);
    
    // Calculate scaled dimensions with fixed scale
    const scaledWidth = width * fixedScale;
    const scaledLeftGutterHeight = leftGutterHeight * fixedScale;
    const scaledRightGutterHeight = rightGutterHeight * fixedScale;
    const scaledRidgeHeight = ridgeHeight * fixedScale;
    const scaledRidgePosition = ridgePosition * fixedScale;

    // Calculate starting position to center the diagram horizontally
    const startX = (canvasWidth - scaledWidth) / 2;
    // Adjust ground position to ensure the diagram is vertically centered
    const groundY = canvasHeight - padding - (canvasHeight - padding * 2 - scaledRidgeHeight) / 2;

    // Draw ground line
    ctx.beginPath()
    ctx.moveTo(padding / 2, groundY)
    ctx.lineTo(canvasWidth - padding / 2, groundY)
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw house outline
    ctx.beginPath();

    // Left wall up to gutter height
    ctx.moveTo(startX, groundY);
    ctx.lineTo(startX, groundY - scaledLeftGutterHeight);

    // Left roof from gutter to ridge
    const leftRoofStartX = startX;
    const leftRoofStartY = groundY - scaledLeftGutterHeight;
    const ridgeX = startX + scaledRidgePosition;
    const ridgeY = groundY - scaledRidgeHeight;
    ctx.lineTo(ridgeX, ridgeY);

    // Right roof from ridge to gutter
    const rightRoofEndX = startX + scaledWidth;
    const rightRoofEndY = groundY - scaledRightGutterHeight;
    ctx.lineTo(rightRoofEndX, rightRoofEndY);

    // Right wall down to ground
    ctx.lineTo(startX + scaledWidth, groundY);

    // Bottom
    ctx.lineTo(startX, groundY);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Fill house
    ctx.fillStyle = 'rgba(200, 200, 255, 0.3)';
    ctx.fill();

    // Set Century Gothic font with increased size (150%)
    ctx.font = 'bold 24px "Century Gothic", CenturyGothic, AppleGothic, sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';

    // Width at bottom
    ctx.fillText(
      `Breedte: ${width} mm`, 
      startX + scaledWidth / 2, 
      groundY + 40
    );

    // Left gutter height
    ctx.save();
    ctx.translate(startX - 25, groundY - scaledLeftGutterHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${leftGutterHeight} mm`, 0, 0);
    ctx.restore();

    // Right gutter height
    ctx.save();
    ctx.translate(startX + scaledWidth + 25, groundY - scaledRightGutterHeight / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`${rightGutterHeight} mm`, 0, 0);
    ctx.restore();

    // Ridge height - displayed horizontally above the ridge
    ctx.fillText(
      `${Math.round(ridgeHeight)} mm`, 
      ridgeX, 
      ridgeY - 30 // Position above the ridge
    );

    // Ridge position from left
    ctx.fillText(
      `${Math.round(ridgePosition)} mm`, 
      startX + scaledRidgePosition / 2, 
      groundY - 20 // Position below the roof
    );

    // Ridge position from right
    ctx.fillText(
      `${Math.round(width - ridgePosition)} mm`, 
      startX + scaledRidgePosition + (scaledWidth - scaledRidgePosition) / 2, 
      groundY - 20 // Position below the roof
    );

    // Left roof angle - along the roof
    ctx.save();
    // Calculate angle for left roof
    const leftRoofAngle = Math.atan2(ridgeY - leftRoofStartY, ridgeX - leftRoofStartX);
    // Position text in middle of left roof
    const leftAngleX = startX + scaledRidgePosition / 2;
    const leftAngleY = groundY - scaledLeftGutterHeight - (scaledRidgeHeight - scaledLeftGutterHeight) / 2;
    ctx.translate(leftAngleX, leftAngleY);
    ctx.rotate(leftRoofAngle);
    ctx.fillText(`${leftAngle}°`, 0, -20); // Increased distance from roof line
    ctx.restore();

    // Right roof angle - along the roof
    ctx.save();
    // Calculate angle for right roof
    const rightRoofAngle = Math.atan2(rightRoofEndY - ridgeY, rightRoofEndX - ridgeX);
    // Position text in middle of right roof
    const rightAngleX = ridgeX + (scaledWidth - scaledRidgePosition) / 2;
    const rightAngleY = groundY - scaledRightGutterHeight - (scaledRidgeHeight - scaledRightGutterHeight) / 2;
    ctx.translate(rightAngleX, rightAngleY);
    ctx.rotate(rightRoofAngle);
    ctx.fillText(`${rightAngle}°`, 0, -20); // Increased distance from roof line
    ctx.restore();

    // Left roof length - along the roof
    ctx.save();
    ctx.translate(leftAngleX, leftAngleY);
    ctx.rotate(leftRoofAngle);
    ctx.fillText(`${Math.round(leftRoofLength)} mm`, 0, 20); // Increased distance from roof line
    ctx.restore();

    // Right roof length - along the roof
    ctx.save();
    ctx.translate(rightAngleX, rightAngleY);
    ctx.rotate(rightRoofAngle);
    ctx.fillText(`${Math.round(rightRoofLength)} mm`, 0, 20); // Increased distance from roof line
    ctx.restore();
    
  }, [width, leftGutterHeight, rightGutterHeight, leftAngle, rightAngle, ridgeHeight, ridgePosition, leftWallHeight, rightWallHeight, leftRoofLength, rightRoofLength])

  return (
    <div className="w-full flex justify-center">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="border border-gray-300 rounded-md"
      />
    </div>
  )
}