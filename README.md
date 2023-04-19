# Canvas3DRenderer

<img width="800" alt="image" src="https://user-images.githubusercontent.com/83934022/232976438-81d2e25d-46f3-4168-9e25-cb6136fbb093.png">\
[바로가기](https://jinsubaek11.github.io/Canvas3DRenderer/)

### 개발 동기

- 3D 그래픽 파이프라인에 대한 이해도를 높이기 위해 제작
- OpenGL이나 WebGL같은 3D 그래픽 API를 사용하지 않고, 2D API를 사용하여 구현

### 클래스 설명

**Renderer**

- 오브젝트, 카메라, 라이트같은 객체들을 초기화/업데이트/렌더링 할 수 있도록 관리

**Canvas**

- Canvas API를 사용할 수 있도록 초기 셋팅
- 화면에 원하는 형태를 그려낼 수 있는 함수들을 작성

**Camera**

- Position, Rotation, Projection, Frustum 등의 카메라 관련 정보 관리
- 자유로운 카메라 무빙을 위해 FPS형식의 카메라 구현
- 여러 카메라를 사용할 수 있도록 배열로 카메라를 관리

**Light**

- 라이트의 위치 값을 저장
- 라이트 매니저 클래스를 활용해 여러 개를 사용할 수 있도록 배열로 관리

**Mesh**

- OBJ 파일을 파싱한 후, 파싱된 데이터를 보관
- OBJ 파싱을 위해 라이브러리 사용

**Texture**

- PNG 파일을 디코딩한 후, 이미지의 넓이, 높이, RGBA와 같은 이미지의 상세 정보를 보관
- PNG 파일 디코딩을 위해 라이브러리 사용

**Polygon**

- Clipping을 진행하며 잘린 물체들의 삼각형은 올바르게 다시 그려질 수 있도록 구현

**Triangle**

- 월드, 뷰, 프로젝션, 클리핑까지 완료된 버텍스와 라이팅이 계산된 명암 값을 저장
- 오브젝트 클래스에서 최종적으로 트라이앵글을 렌더링

**Object**

- Mesh와 Texture를 로드하고, 해당 데이터 관리
- 물체의 위치, 회전, 스케일을 지정할 수 있도록 구현
- 상태 업데이트를 위한 Update 메서드와 렌더링을 위한 Render 함수 구현

**Frustum**

- Frustum을 활용하여 카메라의 Frustum 외부에 있는 물체들은 그리지 않도록 구현

**Plane**

- Frustum을 구현하기 위한 사용되는 Plane 클래스
- 평면을 구현하기 위한 하나의 포인트와 노멀벡터 값 저장

**Matrix / Vector**

- 회전, 이동, 스케일, 곱셈, 덧셈, 내적, 외적 등 계산에 필요한 기능 구현

**Controller**

- 텍스쳐 / 와이어프레임 / 포인트로 선택하여 렌더링 할 수 있도록 구현
- 카메라 이동을 선택할 수 있도록 구현

### 이외 상세 설명

- 보이지 않는 뒷면은 그리지 않도록 BackFace Culling 구현
- 각각의 폴리곤(삼각형)의 색을 채우기 위해 Flat-Bottom / Flat-Top 알고리즘 사용
- 뎁스 버퍼개념을 활용해 가려진 부분의 색을 칠하지 않도록 구현
- 삼각형의 무게중심 좌표를 활용해 텍스처의 UV 좌표를 찾아낼 수 있도록 구현
- 텍스쳐가 올바른 원근감을 가질 수 있도록 원근 보정 맵핑 구현
- 렌더링 개선을 위해 두 개의 캔버스를 사용하여 더블 버퍼링

### 개선이 필요한 부분

- 브라우저의 GPU 가속 옵션 체크 필요
- 파일을 로드하는데 시간이 많이 소요
- 삼각형에 색이나 텍스쳐를 입힐 때, 딱 맞게 채우지 못함
- 삼각형에 색이나 텍스쳐를 입힌 후, 카메라를 움직이면 렌더링이 너무 느림
- 어떤 모델들은 텍스쳐 파일과 텍스쳐 코디네이트 인덱스가 맞지 않는 문제가 존재
- 단일 메시로 이루어진 모델만 렌더링 가능
