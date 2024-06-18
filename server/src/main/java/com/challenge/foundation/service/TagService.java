package com.challenge.foundation.service;

import com.challenge.foundation.dto.TagDto;
import com.challenge.foundation.entity.Tag;
import com.challenge.foundation.exception.AlreadyExistsException;
import com.challenge.foundation.repository.TagRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class TagService {

    private final ModelMapper modelMapper;
    private final TagRepository tagRepository;

    public TagDto getTagByName(TagDto tagDto) {
        Tag tag = tagRepository.findByName(tagDto.getName()).orElse(null);
        if (tag == null) {
            return null;
        }
        return modelMapper.map(tag, TagDto.class);
    }

    public TagDto createTag(TagDto tagDto) {
        Tag tag = tagRepository.findByName(tagDto.getName()).orElse(null);
        if (tag != null) {
            throw new AlreadyExistsException("Tag already exists");
        }
        return modelMapper.map(tagRepository.save(modelMapper.map(tagDto, Tag.class)), TagDto.class);
    }
}
