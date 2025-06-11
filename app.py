#!/usr/bin/env python3
"""
Лендинг для НОК (независимая оценка квалификации) в строительстве и архитектуре
"""

pip install flask

from flask import Flask, render_template, request, flash, redirect, url_for
from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, TelField, SelectField, TextAreaField, BooleanField
from wtforms.validators import DataRequired, Email, Length
from wtforms.widgets import TextArea
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'nok-landing-secret-key-2025')

class ApplicationForm(FlaskForm):
    """Форма заявки на НОК"""
    full_name = StringField('ФИО', validators=[DataRequired(), Length(min=5, max=100)])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    phone = TelField('Телефон', validators=[DataRequired(), Length(min=10, max=20)])
    specialization = SelectField('Специализация', choices=[
        ('', 'Выберите специализацию'),
        ('architect', 'Архитектор'),
        ('structural_engineer', 'Инженер-строитель'),
        ('designer', 'Проектировщик'),
        ('construction_organizer', 'Специалист по организации строительства'),
        ('surveyor', 'Инженер-геодезист'),
        ('other', 'Другая специализация')
    ], validators=[DataRequired()])
    
    company = StringField('Организация', validators=[Length(max=200)])
    experience = SelectField('Опыт работы', choices=[
        ('', 'Выберите опыт'),
        ('1-3', '1-3 года'),
        ('3-5', '3-5 лет'),
        ('5-10', '5-10 лет'),
        ('10+', 'Более 10 лет')
    ])
    
    message = TextAreaField('Дополнительная информация', widget=TextArea())
    consent = BooleanField('Согласие на обработку персональных данных', validators=[DataRequired()])

@app.route('/')
def index():
    """Главная страница лендинга"""
    form = ApplicationForm()
    return render_template('index.html', form=form)

@app.route('/submit', methods=['POST'])
def submit_application():
    """Обработка формы заявки"""
    form = ApplicationForm()
    
    if form.validate_on_submit():
        # В реальном проекте здесь будет интеграция с CRM
        flash('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success')
        return redirect(url_for('index'))
    else:
        flash('Пожалуйста, исправьте ошибки в форме.', 'error')
        return render_template('index.html', form=form)

@app.route('/consultation')
def consultation():
    """Страница консультации"""
    return render_template('consultation.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
