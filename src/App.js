import ImageUploader from './components/ImageUploader';
import styled from 'styled-components';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const App = () => {

  return (
    <AppWrapper>
      <h1>Image Compressor</h1>
      <ImageUploader />
    </AppWrapper>
  );
};

export default App;
