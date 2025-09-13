import tensorflow as tf
from tensorflow.keras import layers, models

train_data_gen = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True
)

test_data_gen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

training_set = train_data_gen.flow_from_directory(
    './dataset/training_set/',
    target_size=(224, 224),
    batch_size=4,
    class_mode='categorical'
)

test_set = test_data_gen.flow_from_directory(
    './dataset/test_set/',
    target_size=(224, 224),
    batch_size=4,
    class_mode='categorical'
)

def create_cnn(input_shape=(224, 224, 3), num_classes=4):
    model = models.Sequential()

    model.add(layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=input_shape))
    model.add(layers.MaxPooling2D((2, 2)))

    model.add(layers.Conv2D(64, (3, 3), activation='relu', padding='same'))
    model.add(layers.MaxPooling2D((2, 2)))

    model.add(layers.Conv2D(128, (3, 3), activation='relu', padding='same'))
    model.add(layers.MaxPooling2D((2, 2)))

    model.add(layers.Flatten())

    model.add(layers.Dense(256, activation='relu'))
    model.add(layers.Dropout(0.5))

    model.add(layers.Dense(num_classes, activation='softmax'))

    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    return model

cnn_model = create_cnn(num_classes=4)

cnn_model.summary()

cnn_model.fit(
    training_set,
    epochs=20,
    validation_data=test_set
)

cnn_model.save('./model.keras')

print("Train  : ", training_set.class_indices)
print("Test : ", test_set.class_indices)
