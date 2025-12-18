import { Button } from '../Button';
import { Card } from '../Card';

export const TailwindDemo = () => (
  <div className="space-y-8">
    {/* 按钮示例 */}
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">按钮组件</h2>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary">主要按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="outline">边框按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        <Button size="sm">小按钮</Button>
        <Button size="md">中按钮</Button>
        <Button size="lg">大按钮</Button>
      </div>
    </section>

    {/* 卡片示例 */}
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">卡片组件</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="默认卡片"
          description="这是一个使用 Tailwind CSS 样式的默认卡片组件。"
          variant="default"
        >
          <Button size="sm">了解更多</Button>
        </Card>
        <Card title="边框卡片" description="这是一个带有边框样式的卡片组件。" variant="outlined">
          <Button size="sm" variant="outline">
            了解更多
          </Button>
        </Card>
        <Card
          title="阴影卡片"
          description="这是一个带有阴影效果的卡片组件，悬停时阴影会增强。"
          variant="elevated"
        >
          <Button size="sm" variant="secondary">
            了解更多
          </Button>
        </Card>
      </div>
    </section>

    {/* 响应式布局示例 */}
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">响应式布局</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl"
          >
            {i + 1}
          </div>
        ))}
      </div>
    </section>

    {/* 颜色示例 */}
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">颜色调色板</h2>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <div className="w-16 h-16 rounded-lg bg-red-500" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">red</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-16 h-16 rounded-lg bg-orange-500" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">orange</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-16 h-16 rounded-lg bg-yellow-500" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">yellow</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-16 h-16 rounded-lg bg-green-500" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">green</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-16 h-16 rounded-lg bg-blue-500" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">blue</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-16 h-16 rounded-lg bg-purple-500" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">purple</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-16 h-16 rounded-lg bg-pink-500" />
          <span className="text-xs text-center text-gray-600 dark:text-gray-400">pink</span>
        </div>
      </div>
    </section>
  </div>
);
