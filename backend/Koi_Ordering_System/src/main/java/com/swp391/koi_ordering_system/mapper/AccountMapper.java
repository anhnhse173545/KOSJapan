package com.swp391.koi_ordering_system.mapper;

import com.swp391.koi_ordering_system.dto.response.AccountDTO;
import com.swp391.koi_ordering_system.model.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {

    @Mapping(source = "profileImg.url", target = "mediaUrl")
    AccountDTO toDTO(Account account);

    @Mapping(source = "mediaUrl", target = "profileImg.url")
    Account toEntity(AccountDTO accountDTO);
}