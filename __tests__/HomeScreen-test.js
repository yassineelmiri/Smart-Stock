import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';

it('should render the welcome text', () => {
  const { getByText } = render(<HomeScreen />);
  expect(getByText('Bienvenue sur l\'application de gestion de stock !')).toBeTruthy();
});