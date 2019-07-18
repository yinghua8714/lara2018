import React, { Component } from 'react';

import { StyleSheet,
        Text,
        View, 
        Platform, 
        Image, 
        TouchableOpacity, 
        TextInput,
        ActivityIndicator,
        Dimensions
    } from 'react-native';

import { Formik } from 'formik';
import * as yup from 'yup';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';

import { URL_API } from '../Utils/url_api';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

// const urlGet = `http://192.168.0.160:8080/api/usuario/verificaLogin?`;
const urlGet = `${URL_API}/usuario/verificaLogin?`;

const validationSchema = yup.object().shape({
    nomeUsuario: yup
    .string()
    .required('Nome do usuário não foi informado')
    .label('nomeUsuario'),
    senha: yup
    .string()
    .required('Senha não foi informada')
    .label('senha')
});

class Home extends Component {

    static navigationOptions = {
        title: 'e-Farmer',
        headerStyle: {
          backgroundColor: '#39b500',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 30
        },
    };

    /**
     * Método para checar se tanto o nomeUsuario quanto senha existem no banco de dados e se pertencem ao mesmo usuário.
     * @author Pedro Biasutti
     * @param values - Dados que foram digitados no form.
     */
    validaForm = async (values) => {

        let validation = 0;

        await axios({
            method: 'get',
            url: urlGet,
            params: {
                nomeUsuario: values.nomeUsuario,
                senha: values.senha
            }
        })
        .then (function(response) {
            console.log('NÃO DEU ERRO CHECA NO BANCO');
            // console.warn(response.status);
            // console.log('Http status: ',response.status);
            
            validation = response.data;

        })
        .catch (function(error){
            console.log('DEU ERRO CHECA NO BANCO');
            // console.warn(error.request.status);            
        })

        if ( validation === -1) {

            alert('O usuário informado não foi encontrado.\n\nPor favor, verifique o usuário digitado e tente novamente.');

        } else if ( validation === 1 ){

            alert('Senha incorreta.\n\nPor favor, digite a senha novamente.\n\nCaso o erro persista, solicitar nova senha');

        }

        return validation;
    }


    render () {
        return (

                <ScrollView>
                    
                    <View style = {{alignItems: 'center'}}>

                        <View style = {{alignItems: 'center'}}>
                            <Image
                                style = {styles.image}
                                source = {require('./../assets/coffee-leaf-beans.png')}
                            />
                        </View>
                    </View>
                                    
                    <Formik

                        initialValues = {{
                            // nomeUsuario: '',
                            // senha: ''
                            nomeUsuario: 'pedrocastro',
                            senha: 'asdasd'
                        }}

                        onSubmit = { async (values, actions) => {

                            let validation = 0;

                            validation = await this.validaForm(values);
                            actions.setSubmitting(false);

                            if (validation === 5) {

                                this.props.navigation.navigate('Menu', {nomeUsuario: values.nomeUsuario});

                            }
                        }}
                        // validateOnBlur= {false}
                        validateOnChange = {false}
                        validationSchema = {validationSchema}
                        >
                        {formikProps => (
                            <React.Fragment>

                                <View>

                                    <View style = {styles.containerStyle}>
                                        <Text style = {styles.labelStyle}>Usuario</Text>
                                        <TextInput
                                            placeholder = 'johnsnow'
                                            style = {styles.inputStyle}
                                            onChangeText = {formikProps.handleChange('nomeUsuario')}
                                            onBlur = {formikProps.handleBlur('nomeUsuario')}
                                            onSubmitEditing = {() => { this.senha.focus() }}
                                            ref = {(ref) => { this.nomeUsuario = ref; }}
                                            returnKeyType = { "next" }
                                        />

                                    </View>

                                    {formikProps.errors.nomeUsuario &&
                                        <View>
                                            <Text style = {{ color: 'red', textAlign: 'center'}}>
                                                {formikProps.touched.nomeUsuario && formikProps.errors.nomeUsuario}
                                            </Text>
                                        </View>
                                    }

                                </View>

                                <View>

                                    <View style = {styles.containerStyle}>
                                        <Text style = {styles.labelStyle}>Senha</Text>
                                        <TextInput
                                            placeholder = 'senha123'
                                            style = {styles.inputStyle}
                                            onChangeText = {formikProps.handleChange('senha')}
                                            onBlur = {formikProps.handleBlur('senha')}
                                            secureTextEntry
                                            ref = {(ref) => { this.senha = ref; }}
                                            returnKeyType={ "next" }
                                        />
                                    </View>

                                    {formikProps.errors.senha &&
                                        <View>
                                            <Text style = {{ color: 'red', textAlign: 'center'}}>
                                                {formikProps.touched.senha && formikProps.errors.senha}
                                            </Text>
                                        </View>
                                    }

                                </View>

                                <View style = {{alignItems: 'center'}}>

                                <Text style = {styles.hiperlink}
                                    onPress = {() => this.props.navigation.navigate('RecuperarSenha')}
                                >
                                Esqueceu sua senha ?
                                </Text>

                                    {formikProps.isSubmitting ? (
                                        <ActivityIndicator/>
                                        ) : (
                                        <View style = {{flexDirection: 'column', flex: 1, width: '50%'}}>

                                            <TouchableOpacity 
                                                style = {styles.button}
                                                onPress={formikProps.handleSubmit}
                                            >
                                                <Text style = {styles.text}>Log In</Text>
                                            </TouchableOpacity>

                                        </View>
                                    )}
                                </View>
                                        
                            </React.Fragment>
                        )}
                        </Formik>

                        <Text style = {[styles.hiperlink, {marginBottom: 20}]}
                            // onPress = {() => this.props.navigation.navigate('Cadastro')}
                            onPress = {() => this.props.navigation.navigate('HttpServer')}
                        >
                        Cadastro
                        </Text>

                </ScrollView>
        );
    }
}

export default Home;

const fontStyle = Platform.OS === 'ios' ? 'Arial Hebrew' : 'serif';

const styles = StyleSheet.create({
    headers: { 
        alignItems: 'center',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: fontStyle,
        color: '#39b500',
        marginTop: 20,
        
    },
    button: {
        alignSelf: 'stretch',
        backgroundColor: '#39b500',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#39b500',
        marginHorizontal: 5,
        marginVertical: 20,
    }, 
    text: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        paddingVertical: 10
    },
    inputStyle:{
        flex:2,
        fontSize: 18,
        lineHeight: 23,
        color: 'black',
        paddingHorizontal: 5,
    },
    labelStyle: {
        flex: 1,
        fontSize: 18,
        paddingLeft: 20,
        
    },
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'black',
        // borderRadius: 4,
        backgroundColor: '#f2f2f2',
        height: 50,
        marginVertical: 15,
        marginHorizontal: 20
    },
    hiperlink: {
        alignSelf: 'center',
        fontSize: 18,
        textDecorationLine: 'underline', 
        color: '#39b500',
        marginTop: 10 
    },
    image: {
        width: 0.5 * screenWidth, 
        height: 0.3 * screenHeight
    }
});
