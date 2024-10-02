package com.swp391.koi_ordering_system.utils;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.enhanced.SequenceStyleGenerator;
import org.hibernate.internal.util.config.ConfigurationHelper;
import org.hibernate.service.ServiceRegistry;
//import org.hibernate.type.LongType;
import org.hibernate.type.Type;
import org.springframework.stereotype.Component;


import java.io.Serializable;
import java.util.Properties;

//@Component
public class AutoGenerateIDPattern extends SequenceStyleGenerator {

//    public static final String VALUE_PREFIX_PARAMETER = "valuePrefix";
//    private String valuePrefix;
//
//    public static final String NUMBER_FORMAT_PARAMETER = "numberFormat";
//    public static final String NUMBER_FORMAT_DEFAULT = "%d";
//    private String numberFormat;
//
//    @Override
//    public Serializable generate(SharedSessionContractImplementor session, Object obj)
//            throws HibernateException {
//        return valuePrefix + String.format(numberFormat, super.generate(session, obj));
//    }
//
//    @Override
//    public void configure(Type type, Properties params, ServiceRegistry serviceRegistry) throws HibernateException {
//        super.configure(LongType.INSTANCE, params, serviceRegistry);
//        valuePrefix = ConfigurationHelper.getString("valuePrefix", params, VALUE_PREFIX_PARAMETER);
//        numberFormat = ConfigurationHelper.getString("numberFormat", params, NUMBER_FORMAT_PARAMETER);
//    }
}
