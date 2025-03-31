"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import RoofDiagram from "@/components/roof-diagram"

export default function Home() {
  // Basic inputs
  const [width, setWidth] = useState<number>(6000)
  const [length, setLength] = useState<number>(10000) // New length input
  const [leftGutterHeight, setLeftGutterHeight] = useState<number>(2500)
  const [rightGutterHeight, setRightGutterHeight] = useState<number>(2500)

  // Angle sliders (in degrees)
  const [leftAngle, setLeftAngle] = useState<number>(30)
  const [rightAngle, setRightAngle] = useState<number>(30)

  // Calculate ridge position based on angles and gutter heights
  // This is the key calculation that determines where the ridge will be horizontally
  const calculateRidgePosition = () => {
    // Convert angles to radians
    const leftRad = leftAngle * Math.PI / 180;
    const rightRad = rightAngle * Math.PI / 180;
    
    // Calculate tangents
    const tanLeft = Math.tan(leftRad);
    const tanRight = Math.tan(rightRad);
    
    // Calculate ridge position
    // If angles are equal, ridge is in the middle
    if (Math.abs(leftAngle - rightAngle) < 0.1) {
      return width / 2;
    }
    
    // Calculate ridge position based on angles and gutter heights
    // This formula finds where the two roof planes intersect
    const heightDiff = rightGutterHeight - leftGutterHeight;
    const ridgePos = (width * tanRight + heightDiff) / (tanLeft + tanRight);
    
    // Constrain ridge position to be within the width
    return Math.max(100, Math.min(width - 100, ridgePos));
  };

  const ridgePosition = calculateRidgePosition();
  
  // Calculate roof heights based on angles and ridge position
  const leftRoofHeight = Math.tan(leftAngle * Math.PI / 180) * ridgePosition;
  const rightRoofHeight = Math.tan(rightAngle * Math.PI / 180) * (width - ridgePosition);
  
  // Calculate ridge height
  const ridgeHeight = Math.max(
    leftGutterHeight + leftRoofHeight,
    rightGutterHeight + rightRoofHeight
  );

  // Wall heights remain the same as gutter heights
  const leftWallHeight = leftGutterHeight;
  const rightWallHeight = rightGutterHeight;
  
  // Calculate roof lengths
  let leftRoofLength = Math.sqrt(Math.pow(ridgePosition, 2) + Math.pow(ridgeHeight - leftGutterHeight, 2));
  let rightRoofLength = Math.sqrt(Math.pow(width - ridgePosition, 2) + Math.pow(ridgeHeight - rightGutterHeight, 2));
  
  // Apply minimum length of 2500mm
  leftRoofLength = Math.max(leftRoofLength, 2500);
  rightRoofLength = Math.max(rightRoofLength, 2500);
  
  // Calculate surface areas in m²
  const leftRoofArea = (leftRoofLength * length) / 1000000; // Convert from mm² to m²
  const rightRoofArea = (rightRoofLength * length) / 1000000; // Convert from mm² to m²
  const totalRoofArea = leftRoofArea + rightRoofArea;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24" style={{ fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif' }}>
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8">Asymmetrisch Zadeldak Calculator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="width">Breedte (mm)</Label>
                  <Input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="length">Lengte (mm)</Label>
                  <Input id="length" type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leftGutterHeight">Linker Goothoogte (mm)</Label>
                  <Input
                    id="leftGutterHeight"
                    type="number"
                    value={leftGutterHeight}
                    onChange={(e) => setLeftGutterHeight(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rightGutterHeight">Rechter Goothoogte (mm)</Label>
                  <Input
                    id="rightGutterHeight"
                    type="number"
                    value={rightGutterHeight}
                    onChange={(e) => setRightGutterHeight(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="leftAngle">Linker Dakhelling</Label>
                    <span>{leftAngle}°</span>
                  </div>
                  <Slider
                    id="leftAngle"
                    min={5}
                    max={60}
                    step={1}
                    value={[leftAngle]}
                    onValueChange={(value) => setLeftAngle(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="rightAngle">Rechter Dakhelling</Label>
                    <span>{rightAngle}°</span>
                  </div>
                  <Slider
                    id="rightAngle"
                    min={5}
                    max={60}
                    step={1}
                    value={[rightAngle]}
                    onValueChange={(value) => setRightAngle(value[0])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Resultaten</h2>
                <div className="grid grid-cols-2 gap-2">
                  <div>Nokhoogte:</div>
                  <div>{Math.round(ridgeHeight)} mm</div>

                  <div>Nokpositie van links:</div>
                  <div>{Math.round(ridgePosition)} mm</div>

                  <div>Linker Muurhoogte:</div>
                  <div>{Math.round(leftWallHeight)} mm</div>

                  <div>Rechter Muurhoogte:</div>
                  <div>{Math.round(rightWallHeight)} mm</div>

                  <div>Linker Dakhelling:</div>
                  <div>{leftAngle}°</div>

                  <div>Rechter Dakhelling:</div>
                  <div>{rightAngle}°</div>

                  <div>Linker Daklengte:</div>
                  <div>{Math.round(leftRoofLength)} mm</div>

                  <div>Rechter Daklengte:</div>
                  <div>{Math.round(rightRoofLength)} mm</div>
                  
                  <div>Oppervlakte linker dakdeel:</div>
                  <div>{leftRoofArea.toFixed(2)} m²</div>
                  
                  <div>Oppervlakte rechter dakdeel:</div>
                  <div>{rightRoofArea.toFixed(2)} m²</div>
                  
                  <div>Totale dakoppervlakte:</div>
                  <div>{totalRoofArea.toFixed(2)} m²</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 w-full">
          <Card>
            <CardContent className="pt-6">
              <RoofDiagram
                width={width}
                leftGutterHeight={leftGutterHeight}
                rightGutterHeight={rightGutterHeight}
                leftAngle={leftAngle}
                rightAngle={rightAngle}
                ridgeHeight={ridgeHeight}
                ridgePosition={ridgePosition}
                leftWallHeight={leftWallHeight}
                rightWallHeight={rightWallHeight}
                leftRoofLength={leftRoofLength}
                rightRoofLength={rightRoofLength}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}