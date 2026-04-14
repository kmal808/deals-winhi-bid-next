import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, FileText } from 'lucide-react'

export default async function AdminPage() {
  // Get counts for dashboard
  const [
    brandsCount,
    frameTypesCount,
    frameColorsCount,
    glassTypesCount,
    gridStylesCount,
    gridSizesCount,
    productConfigsCount,
    usersCount,
    disclaimersCount,
  ] = await Promise.all([
    db.query.brands.findMany().then((r) => r.length),
    db.query.frameTypes.findMany().then((r) => r.length),
    db.query.frameColors.findMany().then((r) => r.length),
    db.query.glassTypes.findMany().then((r) => r.length),
    db.query.gridStyles.findMany().then((r) => r.length),
    db.query.gridSizes.findMany().then((r) => r.length),
    db.query.productConfigs.findMany().then((r) => r.length),
    db.query.representatives.findMany().then((r) => r.length),
    db.query.disclaimers.findMany().then((r) => r.length),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-1">
          Manage system settings and reference data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandsCount}</div>
            <p className="text-xs text-muted-foreground">
              Active brand configurations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frame Types</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameTypesCount}</div>
            <p className="text-xs text-muted-foreground">
              Available frame types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frame Colors</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameColorsCount}</div>
            <p className="text-xs text-muted-foreground">
              Available frame colors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Glass Types</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{glassTypesCount}</div>
            <p className="text-xs text-muted-foreground">
              Available glass types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Styles</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gridStylesCount}</div>
            <p className="text-xs text-muted-foreground">
              Available grid styles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Sizes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gridSizesCount}</div>
            <p className="text-xs text-muted-foreground">
              Available grid sizes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Product Configs
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productConfigsCount}</div>
            <p className="text-xs text-muted-foreground">
              Window and door configurations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
            <p className="text-xs text-muted-foreground">
              System users and representatives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disclaimers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disclaimersCount}</div>
            <p className="text-xs text-muted-foreground">
              Contract disclaimers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use the sidebar to navigate to different settings</li>
          <li>
            • Sort order determines the display order in dropdown menus
          </li>
          <li>
            • Factor values affect pricing calculations (0 = no change, 0.10 =
            10% increase)
          </li>
          <li>• Inactive items won't appear in configuration forms</li>
        </ul>
      </div>
    </div>
  )
}
