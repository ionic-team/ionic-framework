import { IonButton } from '@ionic/react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi, test, expect } from 'vitest';

test('should support onDoubleClick bindings', () => {
  const mockFn = vi.fn();

  render(<IonButton onDoubleClick={mockFn}>Click me</IonButton>);

  // Simulate a double click on the button
  fireEvent.dblClick(screen.getByText('Click me'));

  expect(mockFn).toBeCalled();
});
