import { InteractiveMap } from './extensions/interactive-map';
import { RectangleSelection } from './extensions/rectangle-selection';
import { mixin } from '@attachments/utils/src/public';

/**
 * 多继承
 */
export const CanvasInteractiveMap = mixin(InteractiveMap, RectangleSelection);
