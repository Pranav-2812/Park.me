import numpy as np
import tensorflow as tf

cnn = tf.keras.models.load_model('./model.keras')

test_image = tf.keras.preprocessing.image.load_img(
    'dataset/test_set/barren land image/vivek-HVjIUMmo25s-unsplash.jpg',
    target_size = (224, 224)
)

test_image = tf.keras.preprocessing.image.img_to_array(test_image)

test_image = np.expand_dims(test_image, axis = 0)

result = cnn.predict(test_image)

if result[0][0] == 0:
    prediction = 'Barren Land Image'
elif result[0][0] == 1:
    prediction = 'fabricated_data_imgs'
elif result[0][0] == 2:
    prediction = 'road side'
elif result[0][0] == 3:
    prediction = 'stoone land'
else :
    prediction = 'None'

print('Prediction : ', prediction)